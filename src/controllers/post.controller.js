import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Posts } from "../models/post.model.js";
import { ObjectId } from "bson";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { PostComments } from "../models/postComment.model.js";

const postPost = asyncHandler(async (req, res) => {
  const { owner } = req.params;
  const { message } = req.body;
  const imglocalpath = req.files?.img[0]?.path;
  if (!imglocalpath) {
    throw new ApiError(400, "content local file is required");
  }
  const contentFile = await uploadOnCloudinary(imglocalpath);
  const urlVar = contentFile.url.slice(0, 4) + "s" + contentFile.url.slice(4);

  const postData = await Posts.create({ img: urlVar, owner, message });

  if (!postData) {
    throw new ApiError(500, "something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, postData, "post sent successfully"));
});

const getPost = asyncHandler(async (req, res) => {
  const { currentUser } = req.params;
  const objectId = new ObjectId(currentUser);
  const data = Posts.aggregate([
    {
      $lookup: {
        localField: "owner",
        foreignField: "_id",
        from: "users",
        as: "Parentuser",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        localField: "_id",
        foreignField: "owner",
        from: "postcomments",
        as: "comments",
        pipeline: [
          {
            $lookup: {
              localField: "userid",
              foreignField: "_id",
              from: "users",
              as: "userDetails",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        localField: "_id",
        foreignField: "owner",
        from: "likes",
        as: "likes",
      },
    },
    { $addFields: { totalComments: { $size: "$comments" } } },
    { $addFields: { totalLikes: { $size: "$likes" } } },
    {
      $addFields: {
        isliked: {
          $in: [objectId, "$likes.userid"],
        },
      },
    },
  ]);

  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    customLabels: {
      totalDocs: "totalResults",
      docs: "items",
    },
  };
  const result = await Posts.aggregatePaginate(data, options);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "post sent successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const present = await Posts.findById(id);
  if (!present) {
    throw new ApiError(404, "post not found");
  }

  const data = await Posts.findByIdAndDelete(id);
  const comments = await PostComments.deleteMany({ owner: id });
  return res
    .status(200)
    .json(new ApiResponse(200, data, "deleted successfully"));
});

export { postPost, getPost, deletePost };

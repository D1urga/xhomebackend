import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Posts } from "../models/post.model.js";

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
  const data = await Posts.find();
  return res
    .status(201)
    .json(new ApiResponse(200, data, "post sent successfully"));
});

export { postPost, getPost };

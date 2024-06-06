import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Posts } from "../models/post.model.js";
import { PostComments } from "../models/postComment.model.js";

const postComment = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const { owner, userid } = req.params;

  if (message === "") {
    throw new ApiError(400, "comment requird");
  }

  const data = await PostComments.create({ message, owner, userid });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "posted successfully"));
});

export { postComment };

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Posts } from "../models/post.model.js";
import { PostComments } from "../models/postComment.model.js";
import { Likes } from "../models/like.model.js";

const postlike = asyncHandler(async (req, res) => {
  const { userid, owner } = req.params;

  const isfound = await Likes.findOne({ userid });
  console.log(isfound);
  if (!isfound) {
    const data = await Likes.create({ userid, owner });
    return res
      .status(200)
      .json(new ApiResponse(200, data, "posted successfulyy"));
  } else {
    await Likes.deleteOne({ userid });
    return res
      .status(200)
      .json(new ApiResponse(200, { data: "deleted" }, "deleted"));
  }
});

export { postlike };

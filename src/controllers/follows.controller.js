import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Posts } from "../models/post.model.js";
import { PostComments } from "../models/postComment.model.js";
import { Likes } from "../models/like.model.js";
import { Follows } from "../models/followfollower.models.js";

const follow = asyncHandler(async (req, res) => {
  const { followTo, follower } = req.params;
  const ispresent = await Follows.find({
    $and: [{ followTo: followTo }, { follower: follower }],
  });
  console.log(ispresent);
  if (ispresent.length != 0) {
    throw new ApiError(409, "already following");
  }
  const data = await Follows.create({ followTo, follower });
  return res
    .status(200)
    .json(new ApiResponse(200, data, "followed successfully"));
});

export { follow };

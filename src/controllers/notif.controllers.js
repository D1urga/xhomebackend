import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Posts } from "../models/post.model.js";
import { PostComments } from "../models/postComment.model.js";
import { Likes } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { Notifs } from "../models/notif.models.js";

const postTag = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const { owner } = req.params;
  const user = await User.findOne({ username: username });

  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const userid = user._id;
  const ownername = await User.findById(owner);
  const name = ownername.username;
  const data = await Notifs.create({ owner, taggedTo: userid, name });
  return res
    .status(200)
    .json(new ApiResponse(200, data, "posted successfully"));
});

const getTagged = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Notifs.find({ taggedTo: id });
  return res
    .status(200)
    .json(new ApiResponse(200, data, "fetched successfully"));
});

export { postTag, getTagged };

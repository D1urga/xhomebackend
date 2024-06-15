import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
// import { FollowerFollowing } from "../models/followerFollowing.model.js";
// import { FollowRequests } from "../models/followRequests.model.js";
import { ObjectId } from "bson";
import { GoogleGenerativeAI } from "@google/generative-ai";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields required");
  }
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "user already exits");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering");
  }
  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email required");
  }
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "user does not exits");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      expires: new Date(Date.now() + 30 * 24 * 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .cookie("refreshToken", refreshToken, {
      expires: new Date(Date.now() + 30 * 24 * 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const getUser = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const data = await User.findOne({ email });
  return res.status(200).json(new ApiResponse(200, data, "fetched"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const data = await User.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, data, "fetched successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await User.aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        localField: "_id",
        foreignField: "owner",
        from: "posts",
        as: "allPost",
      },
    },
    {
      $lookup: {
        localField: "_id",
        foreignField: "followTo",
        from: "follows",
        as: "followers",
      },
    },
    {
      $lookup: {
        localField: "_id",
        foreignField: "follower",
        from: "follows",
        as: "following",
      },
    },
    {
      $addFields: {
        isFollowing: {
          $in: [new ObjectId(id), "$followers.follower"],
        },
      },
    },
    { $addFields: { totalFollowers: { $size: "$followers" } } },
    { $addFields: { totalFollowing: { $size: "$following" } } },
    { $addFields: { totalPost: { $size: "$allPost" } } },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "fetched successfully"));
});

const testing = asyncHandler(async (req, res) => {
  const { input } = req.body;
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCPPW9GPz4OrkBVSIS5DoZgb62b5Q3Nji4",
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt =
    "i am anoop kumar a coder developer and investor 5 times hackathon winner write a detailed summary on me ";
  const result = await model.generateContent(input);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return res.status(200).json(new ApiResponse(200, text, "working properly"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUser,
  getAllUsers,
  getUserById,
  testing,
};

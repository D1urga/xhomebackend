import mongoose from "mongoose";

const PostCommentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {},
);

export const Likes = mongoose.model("Likes", PostCommentSchema);

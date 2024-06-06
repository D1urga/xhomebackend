import mongoose from "mongoose";

const PostCommentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
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

export const PostComments = mongoose.model("PostComments", PostCommentSchema);

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    img: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true },
);

export const Posts = mongoose.model("Posts", postSchema);

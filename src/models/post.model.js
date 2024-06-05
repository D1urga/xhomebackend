import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Posts = mongoose.model("Posts", postSchema);

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { postPost } from "../controllers/post.controller.js";

const router = Router();

router
  .route("/postPost")
  .post(upload.fields([{ name: "img", maxCount: 1 }]), postPost);

export default router;

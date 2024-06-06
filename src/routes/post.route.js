import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { getPost, postPost } from "../controllers/post.controller.js";

const router = Router();

router
  .route("/postPost/:owner")
  .post(upload.fields([{ name: "img", maxCount: 1 }]), postPost);

router.route("/getPost/:currentUser").get(getPost);

export default router;

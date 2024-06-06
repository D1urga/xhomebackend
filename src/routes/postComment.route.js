import { Router } from "express";
import { postComment } from "../controllers/postcomment.controller.js";

const router = Router();

router.route("/postComment/:owner/:userid").post(postComment);

export default router;

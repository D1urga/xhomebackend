import { Router } from "express";
import { postlike } from "../controllers/postlike.controller.js";

const router = Router();

router.route("/like/:userid/:owner").post(postlike);

export default router;

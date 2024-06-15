import { Router } from "express";
import { follow } from "../controllers/follows.controller.js";

const router = Router();

router.route("/follow/:followTo/:follower").post(follow);

export default router;

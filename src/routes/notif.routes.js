import { Router } from "express";
import { postTag } from "../controllers/notif.controllers.js";

const router = Router();

router.route("/notif/:owner").post(postTag);

export default router;

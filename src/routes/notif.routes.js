import { Router } from "express";
import { getTagged, postTag } from "../controllers/notif.controllers.js";

const router = Router();

router.route("/notif/:owner").post(postTag);
router.route("/notif/:id").get(getTagged);

export default router;

import * as express from "express";
import FollowController from "./controller";

const router = express.Router();

router.get("/follow", FollowController.getFollow);
router.get("/follow/:id", FollowController.unfollow);

export default router;

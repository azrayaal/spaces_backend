import * as express from "express";
import FollowController from "./controller";
import AuthMiddleware from "../../middleware/auth";

const router = express.Router();

router.get("/follower", AuthMiddleware.Auth, FollowController.getFollow);
router.post("/follow", AuthMiddleware.Auth, FollowController.follow);

export default router;

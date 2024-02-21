import * as express from "express";
import FollowController from "./controller";
import AuthMiddleware from "../../middleware/auth";

const router = express.Router();

router.get("/follow", FollowController.getFollow);
router.post("/follow", AuthMiddleware.Auth, FollowController.follow);
// router.delete("/unfollow/:id", FollowController.unfollow);
// router.get("/follow/:id", FollowController.unfollow);

export default router;

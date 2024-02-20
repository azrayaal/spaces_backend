import * as express from "express";
import FollowController from "./controller";

const router = express.Router();

router.get("/follow", FollowController.getFollow);

export default router;

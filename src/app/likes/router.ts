import * as express from "express";
import LikeControllers from "./controller";
import AuthMiddleware from "../../middleware/auth";

const router = express.Router();

router.post("/likes", AuthMiddleware.Auth, LikeControllers.Like);

export default router;

import * as express from "express";
import LikeControllers from "./controller";
import AuthMiddleware from "../../middleware/auth";

const router = express.Router();

router.post("/likes", AuthMiddleware.Auth, LikeControllers.Like);
router.get("/likes/:id", LikeControllers.getAllLike);

export default router;

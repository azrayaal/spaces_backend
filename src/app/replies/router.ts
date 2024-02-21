import * as express from "express";
import ReplyControllers from "./controller";
import uploadFile from "../../middleware/uploadImage/index";
import AuthMiddleware from "../../middleware/auth";

const router = express.Router();

// router.get("/spaces", ReplyControllers.gettAll);
router.post(
  "/reply",
  uploadFile.upload("image"),
  AuthMiddleware.Auth,
  ReplyControllers.create
);
router.get("/reply/:id", ReplyControllers.getDetail);
router.get("/reply", ReplyControllers.getdetailallReply);
// router.delete("/spaces/:id", AuthMiddleware.Auth, ReplyControllers.delete);

export default router;

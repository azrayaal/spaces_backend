import * as express from "express";
import UserController from "./controller";
import AuthMiddleware from "../../middleware/auth";
import uploadFile from "../../middleware/uploadImage/index";

const router = express.Router();

router.get("/user", UserController.getUser);
router.post("/signIn", UserController.signIn);
router.post(
  "/register",
  uploadFile.upload("profile_picture"),
  UserController.register
);
router.put(
  "/edit-profile/:id",
  uploadFile.upload("profile_picture"),
  UserController.updateUser
);
router.get("/user/:id", UserController.getDetail);
router.get("/testdatauser", AuthMiddleware.Auth, UserController.testDataUser);
router.get("/search-user", UserController.searchUser);

router.get("/suggestion", AuthMiddleware.Auth, UserController.suggestion);

export default router;

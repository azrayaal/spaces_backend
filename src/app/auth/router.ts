import * as express from "express";
import AuthControllers from "./controller";
import uploadFile from "../../middleware/uploadImage/index";
import AuthService from "./services";

const router = express.Router();

// router.post("/signIn", AuthControllers.signIn);
router.post(
  "/register-auth",
  uploadFile.upload("profile_picture"),
  AuthControllers.register
);
router.post("/signin-auth", AuthService.signIn);
router.get("/user-auth", AuthControllers.getUser);

export default router;

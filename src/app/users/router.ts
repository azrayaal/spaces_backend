import * as express from "express";
import UserController from "./controller";
import AuthMiddleware from "../../middleware/auth";

const router = express.Router();

router.get("/user", AuthMiddleware.Auth, UserController.getUser);
router.post("/user", UserController.createUser);
router.post("/signIn", UserController.signIn);
router.post("/register", UserController.register);

export default router;

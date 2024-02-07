import * as express from "express";
import UserController from "./controller";

const router = express.Router();

router.get("/user", UserController.getUser);
router.post("/user", UserController.createUser);
router.post("/signIn", UserController.signIn);
router.post("/register", UserController.register);

export default router;

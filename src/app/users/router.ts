import * as express from "express";
import UserController from "./controller";

const router = express.Router();

router.get("/user", UserController.getUser);
router.post("/user", UserController.createUser);

export default router;

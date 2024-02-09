import * as express from "express";
import SpacesController from "./controller";
import AuthMiddleware from "../../middleware/auth";

const router = express.Router();

router.get("/spaces", SpacesController.gettAll);
router.post("/spaces", AuthMiddleware.Auth, SpacesController.create);
router.get("/spaces/:id", SpacesController.getDetail);
router.delete("/spaces/:id", AuthMiddleware.Auth, SpacesController.delete);

export default router;

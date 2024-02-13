import * as express from "express";
import SpacesController from "./controller";
import uploadFile from "../../middleware/uploadImage/index";
import AuthMiddleware from "../../middleware/auth";

const router = express.Router();

router.get("/spaces", SpacesController.gettAll);
router.post(
  "/spaces",
  uploadFile.upload("image"),
  AuthMiddleware.Auth,
  SpacesController.create
);
router.get("/spaces/:id", SpacesController.getDetail);
router.delete("/spaces/:id", AuthMiddleware.Auth, SpacesController.delete);

export default router;

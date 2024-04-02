import * as express from "express";
import SpacesController from "./controller";
import uploadFile from "../../middleware/uploadImage/index";
import AuthMiddleware from "../../middleware/auth";

const router = express.Router();

router.get("/spaces", SpacesController.gettAll);
router.get("/search-space", SpacesController.searchSpace);

router.post(
  "/spaces",
  uploadFile.upload("image"),
  AuthMiddleware.Auth,
  SpacesController.create
);

router.get("/spaces/:id", SpacesController.getDetail);
// router.get("/search", SpacesController.searchOrSpace);

router.delete(
  "/space-delete/:id",
  AuthMiddleware.Auth,
  SpacesController.delete
);

router.get("/getAllContentsByUser/:id", SpacesController.getAllcontentByUser);

router.get(
  "/getAllContentsByUserLogin",
  AuthMiddleware.Auth,
  SpacesController.getAllcontentByUserLogin
);

export default router;

import * as express from "express";
import SpacesController from "./controller";

const router = express.Router();

router.get("/spaces", SpacesController.gettAll);
router.post("/spaces", SpacesController.create);

export default router;

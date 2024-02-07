import * as express from "express";
import SpacesController from "./controller";

const router = express.Router();

router.get("/spaces", SpacesController.gettAll);

export default router;

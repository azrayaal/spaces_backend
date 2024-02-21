import * as express from "express";
import UserRouter from "./app/users/router";
import SpacesRouter from "./app/spaces/router";
import FollowRouter from "./app/follow/router";
import ReplyRouter from "./app/replies/router";
import LikeRouter from "./app/likes/router";
import { AppDataSource } from "./data-source";
import "dotenv/config";
var cors = require("cors");

AppDataSource.initialize()
  .then(async () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    // router
    app.use("/api/v1", UserRouter);
    app.use("/api/v1", SpacesRouter);
    app.use("/api/v1", FollowRouter);
    app.use("/api/v1", ReplyRouter);
    app.use("/api/v1", LikeRouter);

    // port
    const Port = 3000;
    app.listen(Port, () => {
      console.log(`Server is running in port ${Port}`);
    });
  })
  .catch((error) => console.log(error));

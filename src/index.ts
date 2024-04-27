import * as express from "express";
import UserRouter from "./app/users/router";
import SpacesRouter from "./app/spaces/router";
import FollowRouter from "./app/follow/router";
import ReplyRouter from "./app/replies/router";
import LikeRouter from "./app/likes/router";
import AuhtRouter from "./app/auth/router";
import { AppDataSource } from "./data-source";
import "dotenv/config";
// import { client } from "./libs/redis";
var cors = require("cors");

AppDataSource.initialize()
  .then(async () => {
    const app = express();

    // client.on("error", (err) => console.log("Redis Client Error", err));

    app.use(express.json());
    app.use(cors());

    // router
    app.use("/api/v1", UserRouter);
    app.use("/api/v1", SpacesRouter);
    app.use("/api/v1", FollowRouter);
    app.use("/api/v1", ReplyRouter);
    app.use("/api/v1", LikeRouter);
    app.use("/api/v1", AuhtRouter);

    // port
    const Port = process.env.PORT || 3002;
    app.listen(Port, async () => {
      // await client.connect();
      console.log(`Server is running in port ${Port}`);
      console.log(`
  =====    ========  =======     =====    =      =    =====      =====    =
 =     =         =   =      =   =     =    =    =    =     =    =     =   =
=       =      =     =      =  =       =    =  =    =       =  =       =  =
=========    =       =======   =========     ==     =========  =========  =
=       =  =         =    =    =       =     ==     =       =  =       =  =
=       =  ========  =      =  =       =     ==     =       =  =       =  =========
  `);
    });
  })
  .catch((error) => console.log(error));

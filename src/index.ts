import * as express from "express";
import UserRouter from "./app/users/router";
import SpacesRouter from "./app/spaces/router";
import { AppDataSource } from "./data-source";
import "dotenv/config";

AppDataSource.initialize()
  .then(async () => {
    const app = express();

    app.use(express.json());

    // router
    app.use("/api/v1", UserRouter);
    app.use("/api/v1", SpacesRouter);

    // port
    const Port = 3000;
    app.listen(Port, () => {
      console.log(`Server is running in port ${Port}`);
    });
  })
  .catch((error) => console.log(error));

import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

export default new (class AuthMiddleware {
  Auth(req: Request, res: Response, next: NextFunction): Response {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "unauthorize" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const loginSession = jwt.verify(token, process.env.SECRET_KEY);
      res.locals.loginSession = loginSession;

      const dataUserLokal = jwt.decode(token, { json: true }) as {
        [key: string]: any;
      };

      res.locals.decodedData = dataUserLokal.user;

      console.log("data user local", dataUserLokal.user);

      next();
    } catch (error) {
      return res.status(401).json({ message: `token not valid` });
    }
  }
})();

import { Request, Response } from "express";
import AuthService from "./services";

export default new (class AuthControllers {
  register(req: Request, res: Response) {
    AuthService.register(req, res);
  }

  signIn(req: Request, res: Response) {
    AuthService.signIn(req, res);
  }

  getUser(req: Request, res: Response) {
    AuthService.getAll(req, res);
    console.log("test");
  }
})();

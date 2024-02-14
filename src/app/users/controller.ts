import UserService from "./services";
import { Request, Response } from "express";

export default new (class UserController {
  async register(req: Request, res: Response) {
    try {
      const data = {
        username: req.body.username,
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        profile_picture: res.locals.filename,
        profile_description: req.body.profile_description,
      };

      const response = await UserService.register(data);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const data = req.body;

      const signIn = await UserService.logIn(data);

      res.status(200).json(signIn);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const data = req.body;
      // console.log(data);
      const user = await UserService.create(data);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async testDataUser(req: Request, res: Response) {
    try {
      await UserService.testDataUser();
      console.log("data user Log In", res.locals.decodedData);
      res.status(200).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

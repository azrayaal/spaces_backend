import UserService from "./services";
import { Request, Response } from "express";

export default new (class UserController {
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
      console.log(data);
      const user = await UserService.create(data);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

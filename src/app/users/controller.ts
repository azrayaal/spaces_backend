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
})();

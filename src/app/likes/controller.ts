import LikeService from "./service";
import { Request, Response } from "express";

export default new (class LikeControllers {
  async Like(req: Request, res: Response) {
    try {
      const threadId = req.body.threadId;

      const response = await LikeService.like(threadId);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

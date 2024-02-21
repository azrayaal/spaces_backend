import LikeService from "./service";
import { Request, Response } from "express";

export default new (class LikeControllers {
  async Like(req: Request, res: Response) {
    try {
      const data = {
        created_at: new Date(),
        userId: res.locals.loginSession.user.id,
        spacesId: parseInt(req.body.spacesId),
      };

      const response = await LikeService.like(data);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

import LikeService from "./service";
import { Request, Response } from "express";

export default new (class LikeControllers {
  async Like(req: Request, res: Response) {
    try {
      const data = {
        created_at: new Date(),
        userId: res.locals.loginSession.user.id,
        spacesId: req.body.spacesId,
      };

      console.log(data.spacesId);

      const response = await LikeService.like(data);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllLike(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await LikeService.getAllbyId(id);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

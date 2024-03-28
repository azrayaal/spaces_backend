import FollowService from "./service";
import { Request, Response } from "express";

export default new (class FollowController {
  async getFollowing(req: Request, res: Response) {
    try {
      const id = res.locals.loginSession.user.id;
      // console.log("followingId", id);

      const dataFollow = await FollowService.getDetailFollowing(id);

      res.status(200).json(dataFollow);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getFollower(req: Request, res: Response) {
    try {
      const id = res.locals.loginSession.user.id;
      // console.log("followingId", id);

      const dataFollow = await FollowService.getDetailFollower(id);

      res.status(200).json(dataFollow);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async follow(req: Request, res: Response) {
    try {
      const data = {
        followingId: res.locals.loginSession.user.id,
        followerId: parseInt(req.body.followerId),
      };

      const response = await FollowService.follow(data);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

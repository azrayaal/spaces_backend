import FollowService from "./service";
import { Request, Response } from "express";

export default new (class FollowController {
  async getFollow(req: Request, res: Response) {
    try {
      const follow = await FollowService.getAll();
      res.status(200).json(follow);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // async getfollowdata(req: Request, res: Response){
  //   try {

  //   } catch (error) {
  //     res
  //   }
  // }

  async getDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const detail = await FollowService.getDetail(id);
      res.status(200).json(detail);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getDetailFollow(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const detail = await FollowService.getDetail(id);
      res.status(200).json(detail);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async unfollow(req: Request, res: Response) {
    try {
      const id = req.params;

      const response = await FollowService.unFollow(id);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

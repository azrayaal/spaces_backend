import { Request, Response } from "express";
import SpacesServices from "./services";

export default new (class SpacesController {
  async gettAll(req: Request, res: Response) {
    try {
      const Spaces = await SpacesServices.getAll();

      res.status(200).json(Spaces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      // const decodedData = res.locals.decodedData;

      const data = {
        content: req.body.content,
        image: req.body.image,
        posted_at: Date.now(),
        userId: req.body.userId,
        // userId: decodedData.id
      };

      console.log(data);

      const Spaces = await SpacesServices.create(data);

      res.status(200).json(Spaces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

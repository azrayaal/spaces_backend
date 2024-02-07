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
})();
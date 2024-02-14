import { Request, Response } from "express";
import SpacesServices from "./services";
import cloudinary from "../../libs/cloudinary";

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
      const decodedData = res.locals.decodedData;

      if (req.file) {
        const data = {
          content: req.body.content,
          posted_at: Date.now(),
          userId: decodedData.id,
          image: res.locals.filename,
        };
        const Spaces = await SpacesServices.create(data);
        res.status(200).json(Spaces);
      } else {
        const data = {
          content: req.body.content,
          posted_at: Date.now(),
          userId: decodedData.id,
        };
        const Spaces = await SpacesServices.create(data);
        res.status(200).json(Spaces);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const detail = await SpacesServices.getDetail(id);

      res.status(200).json(detail);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleteSpaces = await SpacesServices.delete(id);

      res.status(200).json(deleteSpaces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

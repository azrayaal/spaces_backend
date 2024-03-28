import { Request, Response } from "express";
import SpacesServices from "./services";
import { SpacesScheme, SpacesSchemeNoImg } from "./validator";
import cloudinaryConfig from "../../libs/cloudinary";

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
      let img = null;
      if (req.file) {
        img = res.locals.filename;
      }

      const data = {
        content: req.body.content,
        created_at: new Date(),
        image: img,
        userId: res.locals.loginSession.user.id,
      };

      if (req.file) {
        // const { error, value } = SpacesScheme.validate(data);
        // if (error) {
        //   return res.status(400).json(error.details[0].message);
        cloudinaryConfig.upload();
        await cloudinaryConfig.destination(data.image);
      }

      const Spaces = await SpacesServices.create(data);
      res.status(200).json(Spaces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // console.log("res.locals.loginSession spaces", res.locals.loginSession);

      const detail = await SpacesServices.getDetail(id);
      console.log(detail);

      res.status(200).json(detail);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const data = {
        id: req.params,
        userId: res.locals.loginSession.user.id,
      };

      const deleteSpaces = await SpacesServices.delete(data);

      res.status(200).json(deleteSpaces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async searchSpace(req: Request, res: Response) {
    try {
      const params = req.query.content;
      // const params = req.body.content;

      const response = await SpacesServices.searchSpace(params);
      // console.log("data prams controller", params);
      // console.log("data body controller", params);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllcontentByUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const getAllContent = await SpacesServices.allContentsByUser(id);

      res.status(200).json(getAllContent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

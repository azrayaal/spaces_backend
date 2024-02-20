import { Request, Response } from "express";
import SpacesServices from "./services";
import cloudinary from "../../libs/cloudinary";
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
      // if (req.file) {
      //   const data = {
      //     content: req.body.content,
      //     created_at: new Date(),
      //     image: res.locals.filename,
      //     userId: res.locals.loginSession.user.id,
      //   };

      //   const { error, value } = SpacesScheme.validate(data);
      //   if (error) {
      //     return res.status(400).json(error.details[0].message);
      //   }

      //   cloudinary.upload();
      //   await cloudinary.destination(value.image);

      //   const Spaces = await SpacesServices.create(value);
      //   res.status(200).json(Spaces);
      // } else {
      //   const data = {
      //     content: req.body.content,
      //     created_at: new Date(),
      //     userId: res.locals.loginSession.user.id,
      //   };

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
        // }

        cloudinary.upload();
        await cloudinary.destination(data.image);
      }
      // const { error, value } = SpacesSchemeNoImg.validate(data);
      // if (error) {
      //   return res.status(400).json(error.details[0].message);
      // }

      console.log(data);

      // const { error } = SpacesSchemeNoImg.validate(data);
      // if (error) {
      //   return res.status(400).json(error.details[0].message);
      // }

      // const Spaces = await SpacesServices.create(value);
      // res.status(200).json(Spaces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const detail = await SpacesServices.getDetail(id);
      // console.log(detail);

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

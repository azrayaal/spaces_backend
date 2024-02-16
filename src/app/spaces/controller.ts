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
      if (req.file) {
        const data = {
          content: req.body.content,
          created_at: new Date(),
          image: res.locals.filename,
          // image: res.locals.imageUrl,
          userId: res.locals.loginSession.user.id,
        };

        const { error, value } = SpacesScheme.validate(data);
        if (error) {
          return res.status(400).json(error.details[0].message);
        }

        cloudinary.upload();
        await cloudinary.destination(value.image);

        // try {
        //   // Upload file ke Cloudinary dan tunggu hasilnya
        //   const cloudinaryResponse = await cloudinaryConfig.destination(
        //     req.file.filename
        //   );
        //   console.log(
        //     "File berhasil diunggah ke Cloudinary:",
        //     cloudinaryResponse
        //   );
        // } catch (error) {
        //   console.error("Gagal mengunggah file ke Cloudinary:", error);
        //   return res.status(500).json({ message: "Internal Server Error" });
        // }

        const Spaces = await SpacesServices.create(value);
        res.status(200).json(Spaces);
      } else {
        const data = {
          content: req.body.content,
          created_at: new Date(),
          userId: res.locals.loginSession.user.id,
        };

        const { error } = SpacesSchemeNoImg.validate(data);
        if (error) {
          return res.status(400).json(error.details[0].message);
        }

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

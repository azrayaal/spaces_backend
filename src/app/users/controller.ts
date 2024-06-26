import UserService from "./services";
import { Request, Response } from "express";
import { UpdateUserScheme, UserScheme } from "./validator";
import cloudinary from "../../libs/cloudinary";

export default new (class UserController {
  async register(req: Request, res: Response) {
    try {
      let img = "hcjqoaztmmi2ykok6wpi";

      if (req.file) {
        img = res.locals.filename;
      }

      const data = {
        username: req.body.username,
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        profile_description: req.body.profile_description,
        profile_picture: img,
        created_at: Date.now(),
      };

      // console.log("data controller", data);

      const { error, value } = UserScheme.validate(data);
      if (error) {
        console.log(error);
        return res.status(400).json(error.details[0].message);
      }

      // console.log("dataimage", value.profile_picture);

      if (req.file) {
        cloudinary.upload();
        await cloudinary.destination(value.profile_picture);
      }

      const response = await UserService.register(value);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const data = req.body;

      const signIn = await UserService.logIn(data);
      res.status(200).json(signIn);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDetail(req: Request, res: Response) {
    try {
      const id = req.params.id;
      // console.log("id params", id);

      const detail = await UserService.getDetail(id);

      res.status(200).json(detail);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // let img = null;
      let hdr = null;

      // if (req.file) {
      //   img = res.locals.filename;
      // }
      if (req.file) {
        hdr = res.locals.filename;
      }

      const data: any = {
        id,
        // username: req.body.username,
        // full_name: req.body.full_name,
        // email: req.body.email,
        // // profile_picture: img,
        // profile_description: req.body.profile_description,
        // header: hdr,
      };

      // Add only the fields that are provided in the request body
      if (req.body.username) data.username = req.body.username;
      if (req.body.full_name) data.full_name = req.body.full_name;
      if (req.body.email) data.email = req.body.email;
      if (req.body.profile_description)
        data.profile_description = req.body.profile_description;
      if (hdr) data.header = hdr;

      // console.log(data);

      const { error, value } = UpdateUserScheme.validate(data);
      if (error) {
        return res.status(400).json(error.details[0].message);
      }

      cloudinary.upload();
      await cloudinary.destination(value.header);

      const updateResponse = await UserService.updateUser(value);
      // const updateResponse = await UserService.updateUser(data);
      res.status(200).json(updateResponse);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  }

  async testDataUser(req: Request, res: Response) {
    try {
      const id = res.locals.loginSession.user.id;
      // console.log(res.locals.loginSession);
      const response = await UserService.testDataUser(id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async searchUser(req: Request, res: Response) {
    try {
      const params = req.query.username;

      const response = await UserService.searchUser(params);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async suggestion(req: Request, res: Response) {
    try {
      const id = res.locals.loginSession.user.id;

      const response = await UserService.suggestion(id);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

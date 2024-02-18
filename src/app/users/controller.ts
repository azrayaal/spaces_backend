import UserService from "./services";
import { Request, Response } from "express";
import { UpdateUserScheme, UserScheme } from "./validator";
import cloudinary from "../../libs/cloudinary";

export default new (class UserController {
  async register(req: Request, res: Response) {
    try {
      const data = {
        username: req.body.username,
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        profile_description: req.body.profile_description,
        profile_picture: res.locals.filename,
        created_at: Date.now(),
      };

      const { error, value } = UserScheme.validate(data);
      if (error) {
        console.log(error);
        return res.status(400).json(error.details[0].message);
      }

      cloudinary.upload();
      await cloudinary.destination(value.profile_picture);

      // console.log(value);
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

  // async createUser(req: Request, res: Response) {
  //   try {
  //     const data = req.body;
  //     // console.log(data);
  //     const user = await UserService.create(data);

  //     res.status(200).json(user);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }

  async getDetail(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const detail = await UserService.getDetail(id);

      res.status(200).json(detail);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = {
        id,
        username: req.body.username,
        full_name: req.body.full_name,
        email: req.body.email,
        profile_picture: res.locals.filename,
        profile_description: req.body.profile_description,
      };

      const { error, value } = UpdateUserScheme.validate(data);
      if (error) {
        return res.status(400).json(error.details[0].message);
      }

      cloudinary.upload();
      await cloudinary.destination(value.profile_picture);

      const updateResponse = await UserService.updateUser(value);
      res.status(200).json(updateResponse);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  }

  async testDataUser(req: Request, res: Response) {
    try {
      await UserService.testDataUser();
      // console.log("data user Log In", res.locals.decodedData);
      res.status(200).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();

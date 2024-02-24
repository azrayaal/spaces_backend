import { Repository } from "typeorm";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import { Request, Response } from "express";
import { AuthScheme } from "./validator";
import * as jwt from "jsonwebtoken";
import cloudinary from "../../libs/cloudinary";
import * as bcrypt from "bcrypt";

export default new (class AuthService {
  private readonly AuthRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async register(req: Request, res: Response): Promise<object | string> {
    try {
      let img =
        "https://res.cloudinary.com/ddpo1vjim/image/upload/v1708411150/SpaceS/68661451_2780877505274604_8670345077089894400_n-1708411149217.png.jpg";

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

      const { error, value } = AuthScheme.validate(data);
      if (error) {
        console.log(error);
        return res.status(400).json(error.details[0].message);
      }

      console.log("dataimage", value);

      if (req.file) {
        cloudinary.upload();
        await cloudinary.destination(value.profile_picture);
      }

      const checkEmail = await this.AuthRepository.count({
        where: { email: data.email },
      });
      if (checkEmail > 0) {
        return `${data.email} has been registered`;
      }
      // HASHING PASSWORD
      const hashPasword = await bcrypt.hash(data.password, 10);

      const obj = this.AuthRepository.create({
        username: data.username,
        full_name: data.full_name,
        email: data.email,
        password: hashPasword,
        profile_picture: data.profile_picture,
        profile_description: data.profile_description,
        created_at: data.created_at,
      });
      // const response = await AuthScheme.register(value);

      const response = await this.AuthRepository.save(obj);

      res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async signIn(req: Request, res: Response): Promise<object | string> {
    try {
      // const data = req.body;

      // const checkEmail = await this.AuthRepository.createQueryBuilder()
      //   .where("email = :email OR username = :username", {
      //     email: data.email,
      //     username: data.username,
      //   })
      //   .getOne();

      // if (!checkEmail) {
      //   return `Your account has been not registered`;
      // }
      // const comparePassword = await bcrypt.compare(
      //   data.password,
      //   checkEmail.password
      // );
      // if (!comparePassword) {
      //   return `Password is wrong!!`;
      // }
      // const user = this.AuthRepository.create({
      //   id: checkEmail.id,
      //   email: checkEmail.email,
      //   // password: checkEmail.password,
      //   username: checkEmail.username,
      //   full_name: checkEmail.full_name,
      //   profile_picture: checkEmail.profile_picture,
      //   profile_description: checkEmail.profile_description,
      // });
      // const token = jwt.sign({ user }, process.env.SECRET_KEY, {
      //   expiresIn: "24h",
      // });

      const token = "test tojen";
      return token;
    } catch (error) {
      return res.status(200).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<object | string> {
    try {
      const data = await this.AuthRepository.createQueryBuilder("user")
        // .leftJoinAndSelect("user.following", "following")
        // .leftJoinAndSelect("user.follower", "follower")
        .loadRelationCountAndMap("user.followingTotal", "user.following")
        .loadRelationCountAndMap("user.followerTotal", "user.follower")
        // .addSelect(["user.user_name as username"])
        .select([
          "user.id",
          "user.username",
          "user.full_name",
          "user.profile_picture",
          "user.profile_description",
          "user.created_at",
        ])
        .getMany();
      return data;
    } catch (error) {
      return {
        message: `Ooops something went wrong, please see this ==>> ${error}`,
      };
    }
  }
})();

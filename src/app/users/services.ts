import { Repository, FindOptions } from "typeorm";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

export default new (class UserServices {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async register(data: any) {
    try {
      // CHECK EMAIL
      const checkEmail = await this.UserRepository.count({
        where: { email: data.email },
      });
      if (checkEmail > 0) {
        return `${data.email} has been registered`;
      }
      // HASHING PASSWORD
      const hashPasword = await bcrypt.hash(data.password, 10);

      const obj = this.UserRepository.create({
        username: data.username,
        full_name: data.full_name,
        email: data.email,
        password: hashPasword,
        profile_picture: data.profile_picture,
        profile_description: data.profile_description,
      });

      const response = await this.UserRepository.save(obj);

      return {
        message: `Success!, new User has been added!`,
        response,
      };
    } catch (error) {
      return {
        message: `Ooops something went wrong during register, please see this ==>> ${error}`,
      };
    }
  }

  async logIn(data: any) {
    try {
      const checkEmail = await this.UserRepository.createQueryBuilder("user")
        .where("user.email = :email OR user.username = :username", {
          email: data.email,
          username: data.username,
        })
        .getOne();

      if (!checkEmail) {
        return `${data.email} has been not registered`;
      }
      const comparePassword = await bcrypt.compare(
        data.password,
        checkEmail.password
      );
      if (!comparePassword) {
        return `Password is wrong!!`;
      }
      const user = this.UserRepository.create({
        id: checkEmail.id,
        email: checkEmail.email,
        // password: checkEmail.password,
        username: checkEmail.username,
        full_name: checkEmail.full_name,
        profile_picture: checkEmail.profile_picture,
        profile_description: checkEmail.profile_description,
      });
      const token = jwt.sign({ user }, process.env.SECRET_KEY, {
        expiresIn: "24h",
      });
      return { message: `Login Success!`, token };
    } catch (error) {
      return {
        message: `Ooops something went error during Log In, please see this ${error}`,
      };
    }
  }

  async getAll(): Promise<object | string> {
    try {
      const data = await this.UserRepository.find();
      return data;
    } catch (error) {
      return {
        message: `Ooops something went wrong, please see this ==>> ${error}`,
      };
    }
  }

  async create(data: any): Promise<object | string> {
    try {
      const response = await this.UserRepository.save(data);
      return {
        response,
        message: "New User has been added",
      };
    } catch (error) {
      return {
        message: `Ooops something went wrong during create new user, please see this ==>> ${error}`,
      };
    }
  }
})();

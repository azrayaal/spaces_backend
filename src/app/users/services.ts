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
        created_at: data.posted_at,
      });

      // console.log("data regis", obj);

      const response = await this.UserRepository.save(obj);

      return {
        message: `Success!, You just created new account!`,
        // response,
      };
    } catch (error) {
      return {
        message: `Ooops something went wrong during register, please see this ==>> ${error}`,
      };
    }
  }

  async logIn(data: any) {
    try {
      const checkEmail = await this.UserRepository.createQueryBuilder()
        .where("email = :email OR username = :username", {
          email: data.email,
          username: data.username,
        })
        .getOne();

      if (!checkEmail) {
        return `Your account has been not registered`;
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
      const data = await this.UserRepository.createQueryBuilder("user")
        // .leftJoinAndSelect("user.following", "following")
        // .leftJoinAndSelect("user.follower", "follower")
        .loadRelationCountAndMap("user.followingTotal", "user.following")
        .loadRelationCountAndMap("user.followerTotal", "user.follower")
        .getMany();
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

  async getDetail(id: any): Promise<object | string> {
    try {
      const chekId = await this.UserRepository.findOne({ where: { id } });
      if (!chekId) {
        return {
          message: `Id can not be found`,
        };
      }

      const detailUser = await this.UserRepository.createQueryBuilder("user")
        .leftJoinAndSelect("user.following", "following")
        .leftJoinAndSelect("user.follower", "follower")
        .loadRelationCountAndMap("user.followingTotal", "user.following")
        .loadRelationCountAndMap("user.followerTotal", "user.follower")
        .getOne();

      return detailUser;
    } catch (error) {
      return {
        message: `Ooops something went wrong during getDetail, please see this ==>> ${error}`,
      };
    }
  }
  async updateUser(data: any): Promise<object | string> {
    try {
      const {
        id,
        username,
        full_name,
        email,
        profile_picture,
        profile_description,
      } = data;

      const existingUser = await this.UserRepository.findOne({ where: { id } });
      if (!existingUser) {
        return {
          message: `User can not be found`,
        };
      }

      existingUser.username = username;
      existingUser.full_name = full_name;
      existingUser.email = email;
      existingUser.profile_picture = profile_picture;
      existingUser.profile_description = profile_description;

      const updateUser = await this.UserRepository.save(existingUser);

      return { message: `Success, your account has been updated!`, updateUser };
    } catch (error) {
      return {
        message: `Ooops something went wrong during getDetail, please see this ==>> ${error}`,
      };
    }
  }

  async testDataUser(): Promise<object | string> {
    try {
      await this.UserRepository.find();
    } catch (error) {
      return {
        message: `Ooops something went wrong during test data user, please see this ${error}`,
      };
    }
  }

  async searchUser(params: any): Promise<object | string> {
    try {
      const response = await this.UserRepository.createQueryBuilder("user")
        .leftJoinAndSelect("user.following", "following")
        .leftJoinAndSelect("user.follower", "follower")
        .loadRelationCountAndMap("user.followingTotal", "user.following")
        .loadRelationCountAndMap("user.followerTotal", "user.follower")
        .where("user.username LIKE :username", { username: `%${params}%` })

        .getMany();

      return response;
    } catch (error) {
      return {
        message: `Ooops something went wrong during search user, please see this ${error}`,
      };
    }
  }
})();

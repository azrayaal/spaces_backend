import { Repository, FindOptions } from "typeorm";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { Follow } from "../../entities/Follow";
import { client } from "../../libs/redis";

export default new (class UserServices {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);
  private readonly FollowRepository: Repository<Follow> =
    AppDataSource.getRepository(Follow);

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
        created_at: data.created_at,
      });

      console.log("data regis", obj);

      const response = await this.UserRepository.save(obj);

      return {
        message: `Success!, You just created new account!`,
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
        .loadRelationCountAndMap("user.followingTotal", "user.following")
        .loadRelationCountAndMap("user.followerTotal", "user.follower")
        .where("email = :email OR username = :username", {
          email: data.email,
          username: data.username,
          id: data.id,
        })
        .getOne();

      // console.log("checkEmail", checkEmail);

      if (!checkEmail) {
        return `Your account has not been registered`;
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
        created_at: checkEmail.created_at,
        username: checkEmail.username,
        full_name: checkEmail.full_name,
        profile_picture: checkEmail.profile_picture,
        profile_description: checkEmail.profile_description,
      });

      // console.log("userobj", user);

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

      console.log("checkId", chekId);

      const detailUser = await this.UserRepository.createQueryBuilder("user")
        .leftJoinAndSelect("user.following", "following")
        .leftJoinAndSelect("user.follower", "follower")
        .loadRelationCountAndMap("user.followingTotal", "user.following")
        .loadRelationCountAndMap("user.followerTotal", "user.follower")
        .where({ id: chekId.id })
        .getOne();

      // const detailUser = await this.UserRepository.findOne({
      //   where: { id: chekId.id },
      //   relations: {
      //     following: true,
      //     follower: true,
      //   },
      // });

      console.log("DetailUser", detailUser);

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
        // profile_picture,
        profile_description,
        header,
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
      // existingUser.profile_picture = profile_picture;
      existingUser.profile_description = profile_description;
      existingUser.header = header;

      const updateUser = await this.UserRepository.save(existingUser);

      // console.log(existingUser);

      return { message: `Success, your account has been updated!`, updateUser };
    } catch (error) {
      return {
        message: `Ooops something went wrong during getDetail, please see this ==>> ${error}`,
      };
    }
  }

  async testDataUser(id: number): Promise<object | string> {
    try {
      const response = await this.UserRepository.findOne({ where: { id } });
      return {
        message: `User Log-In`,
        response,
      };
    } catch (error) {
      return {
        message: `Ooops something went wrong during test data user, please see this ${error}`,
      };
    }
  }

  async searchUser(params: any): Promise<object | string> {
    try {
      let dataRedis = await client.get("userSearch");
      if (!dataRedis) {
        const userSearch = await this.UserRepository.createQueryBuilder("user")
          .leftJoinAndSelect("user.following", "following")
          .leftJoinAndSelect("user.follower", "follower")
          .loadRelationCountAndMap("user.followingTotal", "user.following")
          .loadRelationCountAndMap("user.followerTotal", "user.follower")
          .where("user.username LIKE :username", { username: `${params}%` })
          .take(5)
          .getMany();

        const dataString = JSON.stringify(userSearch);
        dataRedis = dataString;
        await client.set("userSearch", dataRedis);
      }

      return JSON.parse(dataRedis);
    } catch (error) {
      return {
        message: `Ooops something went wrong during search user, please see this ${error}`,
      };
    }
  }

  // buat kondisi di mana tampilkan user dari followingId yang belum ada di followerId
  async suggestion(id: number): Promise<object | string> {
    try {
      // const user = await this.UserRepository.findOne({
      //   where: {
      //     id: id,
      //   },
      //   relations: {
      //     follower: true,
      //     following: true,
      //   },
      // });

      // const userId = user.id;

      // followingUserId adalah orang yang difollow diambil dari table follower
      // const followingUserId = user.follower.map((follow) => follow.id);

      // const followingUserIds = user.following.map((follow) => follow.id);
      const suggestions = await this.UserRepository.createQueryBuilder("user")
        // .leftJoinAndSelect("user.follower", "follower")
        // .leftJoinAndSelect("user.following", "following")
        // .where("follower.id =:follower", { followingUserId })
        // .andWhere("user.id != :id", { id })
        .where("user.id != :id", { id })
        .orderBy("user.id")
        .limit(3)
        .getMany();

      return suggestions;
    } catch (error) {
      return {
        message: `Ooops something went error during get suggestion, ${error}`,
      };
    }
  }
})();

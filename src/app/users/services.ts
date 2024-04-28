import { Repository, FindOptions, getRepository, Not, In } from "typeorm";
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
        return {
          message: `${data.email} has been registered`,
          status: 401,
        };
      }
      const checkUserName = await this.UserRepository.count({
        where: { username: data.username },
      });
      if (checkUserName > 0) {
        return {
          message: `username "${data.username}" has been registered`,
          status: 401,
        };
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
        header: "fx4fml93yssxzjetliv6",
      });

      // console.log("data regis", obj);

      const response = await this.UserRepository.save(obj);

      return {
        message: `Success!, You just created new account!`,
        status: 400,
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
        return {
          message: `Your account has not been registered`,
          status: 401,
        };
      }
      const comparePassword = await bcrypt.compare(
        data.password,
        checkEmail.password
      );
      if (!comparePassword) {
        return {
          message: `Password is wrong!!`,
          status: 401,
        };
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
      return { message: `Login Success!`, token, status: 200 };
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

      // console.log("checkId", chekId);

      const detailUser = await this.UserRepository.createQueryBuilder("user")
        .leftJoinAndSelect("user.following", "following")
        .leftJoinAndSelect("user.follower", "follower")
        .leftJoinAndSelect("user.likes", "likes")
        .leftJoinAndSelect("user.spaces", "spaces")
        .loadRelationCountAndMap("user.followingTotal", "user.following")
        .loadRelationCountAndMap("user.followerTotal", "user.follower")
        .loadRelationCountAndMap("user.spaces", "user.spaces")
        .where({ id: chekId.id })
        .getOne();

      // const detailUser = await this.UserRepository.findOne({
      //   where: { id: chekId.id },
      //   relations: {
      //     following: true,
      //     follower: true,
      //   },
      // });

      // console.log("DetailUser", detailUser);

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

      return {
        message: `Success, your account has been updated!`,
        updateUser,
      };
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
      const userSearch = await this.UserRepository.createQueryBuilder("user")
        .leftJoinAndSelect("user.following", "following")
        .leftJoinAndSelect("user.follower", "follower")
        .loadRelationCountAndMap("user.followingTotal", "user.following")
        .loadRelationCountAndMap("user.followerTotal", "user.follower")
        .where("user.username LIKE :username", { username: `${params}%` })
        .take(5)
        .getMany();

      return { userSearch };
    } catch (error) {
      return {
        message: `Ooops something went wrong during search user, please see this ${error}`,
      };
    }
  }

  // buat kondisi di mana tampilkan user dari followingId yang belum ada di followerId
  async suggestion(id: number): Promise<object | string> {
    try {
      const userId = id;

      const followedUsers = await this.FollowRepository.find({
        where: {
          following: { id: userId },
        },
        relations: {
          follower: true,
        },
        select: ["follower"],
      });

      // if (!followedUsers || followedUsers.length === 0) {
      //   return {
      //     message: "Not following anyone.",
      //   };
      // }
      const followedIds = followedUsers.map((follow) => follow.follower.id);

      // Check if followedIds array is empty or undefined
      const userIdsToExclude = followedIds.length > 0 ? followedIds : [0];

      let suggestions = await this.UserRepository.find({
        where: {
          id: Not(In([userId, ...userIdsToExclude])),
        },
        // take: 3,
      });

      suggestions = shuffleArray(suggestions);

      // Take only the first 3 elements
      suggestions = suggestions.slice(0, 3);

      return suggestions;
    } catch (error) {
      return {
        message: `Ooops something went error during get suggestion, ${error}`,
      };
    }
  }
})();

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

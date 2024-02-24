import { Repository } from "typeorm";
import { Spaces } from "../../entities/Space";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";

export default new (class SpacesServices {
  private readonly SpacesRepository: Repository<Spaces> =
    AppDataSource.getRepository(Spaces);
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async getAll(): Promise<object | string> {
    try {
      const data = await this.SpacesRepository.createQueryBuilder("spaces")
        .leftJoinAndSelect("spaces.user", "user")
        .leftJoinAndSelect("spaces.replies", "replies")
        .leftJoinAndSelect("spaces.likes", "likes")
        .loadRelationCountAndMap("spaces.Total_Replies", "spaces.replies")
        .loadRelationCountAndMap("spaces.Total_Likes", "spaces.likes")
        // .select([
        //   "spaces.id",
        //   "spaces.content",
        //   "spaces.image",
        //   "user.id",
        //   "full_name",
        //   "username",
        //   "email",
        //   "profile_picture",
        //   "profile_description",
        // ])
        .orderBy("spaces.id", "DESC")
        // .getCount();
        // .getRawMany();
        .getMany();

      return data;
    } catch (error) {
      return {
        message: `Ooops something went wrong during getting all the spaces ==>> ${error}`,
      };
    }
  }

  async create(data: any): Promise<object | string> {
    try {
      const userId = data.userId;

      const user = await this.UserRepository.findOne({
        where: { id: userId },
      });

      const newSpaces = this.SpacesRepository.create({
        ...data,
        user: user,
      });

      console.log("data create", { newSpaces });

      const response = await this.SpacesRepository.save(newSpaces);

      return {
        response,
        message: `New Spaces has been added`,
      };
    } catch (error) {
      return {
        message: `Ooops something went wrong during create content spaces, please see this ==>> ${error}`,
      };
    }
  }

  async getDetail(id: any): Promise<object | string> {
    try {
      const checkId = await this.SpacesRepository.findOne({ where: { id } });
      if (!checkId) {
        return { message: `Ooops sorry SpaceS cant be found` };
      }

      const spaceDetail = await this.SpacesRepository.createQueryBuilder(
        "spaces"
      )
        .leftJoin("spaces.user", "user")
        .leftJoin("spaces.replies", "replies")
        .loadRelationCountAndMap("spaces.total_Replies", "spaces.replies")
        .loadRelationCountAndMap("spaces.total_Likes", "spaces.likes")
        .select([
          "spaces.id",
          "spaces.content",
          "spaces.image",
          "spaces.created_at",
          "user.id",
          "user.full_name",
          "user.username",
          "user.profile_picture",
        ])
        .where("spaces.id = :id", { id })
        .getOne();

      return spaceDetail;
    } catch (error) {
      return {
        message: `Ooops something went wrong during get detail, please see this ==>> ${error}`,
      };
    }
  }

  async update(data: any): Promise<object | string> {
    try {
      const { id } = data;
      const existingSpace = await this.SpacesRepository.findOne({
        where: { id },
      });

      if (!existingSpace) {
        return {
          message: `Ooops SpaceS can't be found`,
        };
      }

      const updateSpace = await this.SpacesRepository.save(existingSpace);

      return updateSpace;
    } catch (error) {
      return {
        message: `Ooops something went wrong during update spaces, please see this ${error}`,
      };
    }
  }

  async delete(data: any): Promise<object | string> {
    try {
      const { id } = data.id;
      const userId = data.userId;

      const user = await this.UserRepository.findOne({ where: { id: userId } });
      const space = await this.SpacesRepository.findOne({ where: { id } });
      if (!space) {
        return { message: `Ooops SpaceS can't be found` };
      }

      const deleteSpace = await this.SpacesRepository.findOne({
        where: {
          id: space.id,
          user: { id: user.id },
          // kiri diambil dari entity, kanan diambil dari reb body yg udah kita find
        },
      });

      if (deleteSpace) {
        const deleteSpaces = await this.SpacesRepository.delete(id);
        return {
          message: `Spaces has been deleted!`,
          deleteSpaces,
        };
      }
      return {
        message: `you cannot delete this content`,
      };
    } catch (error) {
      return {
        message: `Ooops something went wrong during delete SpaceS, please see this ==>> ${error}`,
      };
    }
  }

  async searchSpace(params: any): Promise<object | string> {
    try {
      const response = await this.SpacesRepository.createQueryBuilder("spaces")
        .where("spaces.content LIKE :content", { content: `%${params}%` })
        .getMany();

      console.log(response);

      return response;
    } catch (error) {
      return {
        message: `Ooops something went wrong during serching space, please see this ${error}`,
      };
    }
  }

  // async searchSpaceorUser(params: any): Promise<object | string> {
  //   try {
  //     // const response = await this.UserRepository.createQueryBuilder("user")
  //     //   .leftJoinAndSelect("user.following", "following")
  //     //   .leftJoinAndSelect("user.follower", "follower")
  //     //   .loadRelationCountAndMap("user.followingTotal", "user.following")
  //     //   .loadRelationCountAndMap("user.followerTotal", "user.follower")
  //     //   .where("user.username LIKE :username", { username: `%${params}%` })
  //     //   .getMany();
  //     // const response = await this.UserRepository.createQueryBuilder("user")
  //     //   .leftJoinAndSelect("user.following", "following")
  //     //   .leftJoinAndSelect("user.follower", "follower")
  //     //   .loadRelationCountAndMap("user.followingTotal", "user.following")
  //     //   .loadRelationCountAndMap("user.followerTotal", "user.follower")
  //     //   .where("spaces.content LIKE :content OR user.username LIKE :username", {
  //     //     username: `%${params}%`,
  //     //     content: `%${params}%`,
  //     //   })
  //     //   .getMany();
  //     // const userQuery = this.UserRepository.createQueryBuilder("user")
  //     //   .leftJoinAndSelect("user.following", "following")
  //     //   .leftJoinAndSelect("user.follower", "follower")
  //     //   .loadRelationCountAndMap("user.followingTotal", "user.following")
  //     //   .loadRelationCountAndMap("user.followerTotal", "user.follower")
  //     //   .where("user.username LIKE :username", { username: `%${params}%` });
  //     // const spacesQuery = this.SpacesRepository.createQueryBuilder(
  //     //   "spaces"
  //     // ).where("spaces.content LIKE :content", { content: `%${params}%` });
  //     // const response = await this.UserRepository.createQueryBuilder()
  //     //   .select("*")
  //     //   .from((qb) => {
  //     //     return qb
  //     //       .select(["user.*"])
  //     //       .from("(" + userQuery.getQuery() + ")", "user")
  //     //       .unionAll((qb) => {
  //     //         return qb
  //     //           .select([
  //     //             "spaces.*",
  //     //             "'0' AS followingTotal",
  //     //             "'0' AS followerTotal",
  //     //             "NULL AS following",
  //     //             "NULL AS follower",
  //     //           ])
  //     //           .from("(" + spacesQuery.getQuery() + ")", "spaces");
  //     //       });
  //     //   }, "result")
  //     //   .setParameters(userQuery.getParameters())
  //     //   .getRawMany();
  //     // console.log(response);
  //     // const response = await this.UserRepository.createQueryBuilder("user")
  //     //   .leftJoinAndSelect("user.following", "following")
  //     //   .leftJoinAndSelect("user.follower", "follower")
  //     //   .loadRelationCountAndMap("user.followingTotal", "user.following")
  //     //   .loadRelationCountAndMap("user.followerTotal", "user.follower")
  //     //   .where("user.username LIKE :username OR spaces.content LIKE :content", {
  //     //     username: `%${params}%`,
  //     //     content: `%${params}%`,
  //     //   })
  //     //   .getMany();
  //     // return response;
  //   } catch (error) {
  //     return {
  //       message: `Ooops something went error during search user or space, please see this ${error}`,
  //     };
  //   }
  // }
})();

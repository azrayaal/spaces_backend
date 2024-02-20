import { Repository } from "typeorm";
import { Replies } from "../../entities/Replies";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import { Spaces } from "../../entities/Space";

export default new (class ReplyServices {
  private readonly RepliesRepository: Repository<Replies> =
    AppDataSource.getRepository(Replies);
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);
  private readonly SpaceRepository: Repository<Spaces> =
    AppDataSource.getRepository(Spaces);

  //   async getAll(): Promise<object | string> {
  //     try {
  //       const data = await this.SpacesRepository.createQueryBuilder("spaces")
  //         .leftJoinAndSelect("spaces.user", "user")
  //         .select([
  //           "spaces.id",
  //           "spaces.content",
  //           "spaces.image",
  //           "user.id",
  //           "full_name",
  //           "username",
  //           "email",
  //           "profile_picture",
  //           "profile_description",
  //         ])
  //         .orderBy("spaces.id", "DESC")
  //         // .getCount();
  //         .getRawMany();

  //       return data;
  //     } catch (error) {
  //       return {
  //         message: `Ooops something went wrong during getting all the spaces ==>> ${error}`,
  //       };
  //     }
  //   }

  async create(data: any): Promise<object | string> {
    try {
      const userId = data.userId;
      const spaceId = data.spaceId;

      const user = await this.UserRepository.findOne({
        where: { id: userId },
      });

      const space = await this.SpaceRepository.findOne({
        where: { id: spaceId },
      });

      const newReply = this.RepliesRepository.create({
        ...data,
        user: user,
        space: space,
      });

      console.log("Reply create", { ...data, user, space });

      const response = await this.RepliesRepository.save(newReply);

      return {
        response,
        message: `Succes!`,
      };
    } catch (error) {
      return {
        message: `Ooops something went wrong during reply spaces, please see this ==>> ${error}`,
      };
    }
  }

  async getDetail(id: any): Promise<object | string> {
    try {
      const checkId = await this.RepliesRepository.findOne({ where: { id } });
      if (!checkId) {
        return { message: `Ooops sorry Replies cant be found` };
      }

      const replyDetail = await this.RepliesRepository.createQueryBuilder(
        "replies"
      )
        // .leftJoinAndSelect("replies.user", "user")
        .leftJoin("replies.user", "user")
        .select([
          "replies.id",
          "replies.content",
          "replies.image",
          "replies.created_at",
          "user.id",
          //   "user.full_name",
          //   "user.username",
          //   "user.profile_picture",
        ])
        // .where("replies.id = :id", { id })
        .getOne();

      return replyDetail;
    } catch (error) {
      return {
        message: `Ooops something went wrong during get detail, please see this ==>> ${error}`,
      };
    }
  }

  //   async update(data: any): Promise<object | string> {
  //     try {
  //       const { id } = data;
  //       const existingSpace = await this.SpacesRepository.findOne({
  //         where: { id },
  //       });

  //       if (!existingSpace) {
  //         return {
  //           message: `Ooops SpaceS can't be found`,
  //         };
  //       }

  //       const updateSpace = await this.SpacesRepository.save(existingSpace);

  //       return updateSpace;
  //     } catch (error) {
  //       return {
  //         message: `Ooops something went wrong during update spaces, please see this ${error}`,
  //       };
  //     }
  //   }

  async delete(id: any): Promise<object | string> {
    try {
      const checkId = await this.RepliesRepository.findOne({ where: { id } });
      if (!checkId) {
        return { message: `Ooops SpaceS can't be found` };
      }

      const deleteSpaces = await this.RepliesRepository.delete(id);

      return {
        message: `Spaces has been deleted!`,
        deleteSpaces,
      };
    } catch (error) {
      return {
        message: `Ooops something went wrong during delete SpaceS, please see this ==>> ${error}`,
      };
    }
  }
})();

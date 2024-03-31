import { Repository } from "typeorm";
import { Replies } from "../../entities/Replies";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import { Spaces } from "../../entities/Space";
import { client } from "../../libs/redis";

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
      const dataRedis = await client.get("spaces");
      if (dataRedis) {
        await client.del("spaces");
      }
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
        user,
        spaces: space,
      });

      // console.log("Reply spaceid", space);
      // console.log("object data reply", newReply);
      // console.log("spaceId biasa", space);
      // console.log("spaceId biasa", space);

      const response = await this.RepliesRepository.save(newReply);

      // const response = await this.RepliesRepository.createQueryBuilder()
      //   .insert()
      //   .into(Replies)
      //   .values({
      //     content: data.content,
      //     image: data.image,
      //     created_at: data.created_at,
      //     user: data.userId,
      //     spaces: data.spaceId,
      //   })
      //   .execute();

      return {
        response,
        newReply,
        message: `Success!`,
      };
    } catch (error) {
      return {
        message: `Ooops something went wrong during reply spaces, please see this ==>> ${error}`,
      };
    }
  }

  async getDetail(id: any): Promise<object | string> {
    try {
      // let dataRedis = await client.get("replyDetail");

      const checkId = await this.RepliesRepository.findOne({ where: { id } });
      if (!checkId) {
        return { message: `Ooops sorry Replies cant be found` };
      }
      // if (!dataRedis) {
      const replyDetail = await this.RepliesRepository.createQueryBuilder(
        "replies"
      )
        // .leftJoinAndSelect("replies.user", "user")
        .leftJoinAndSelect("replies.user", "user")
        .leftJoinAndSelect("replies.spaces", "spaces")

        // .select([
        //   "replies.id",
        //   "replies.content",
        //   "replies.image",
        //   "replies.created_at",
        //   "user.id",
        //   "spaces.id",
        //   "spaces.content",
        //   "user.username",
        //   "user.profile_picture",
        // ])
        // .where("replies.id = :id", { id })
        .getOne();

      //   const dataString = JSON.stringify(replyDetail);
      //   dataRedis = dataString;
      //   await client.set("replyDetail", dataRedis);
      // }

      // return JSON.parse(dataRedis);
      return replyDetail;
    } catch (error) {
      return {
        message: `Ooops something went wrong during get detail, please see this ==>> ${error}`,
      };
    }
  }

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

  // async getdetailallReply(params: any): Promise<object | string> {
  //   try {
  //     const response = await this.RepliesRepository.createQueryBuilder("reply")
  //       .leftJoinAndSelect("reply.user", "user")
  //       .leftJoinAndSelect("reply.spaces", "spaces")
  //       // .orderBy({ where: { id: params } })
  //       .getOne();

  //     // findOne({ where: params });
  //     console.log(response);

  //     return response;
  //   } catch (error) {
  //     return {
  //       message: `Oops something went error during getdetailreply, please see this ${error}`,
  //     };
  //   }
  // }

  async getAllbyId(id: any): Promise<object | string> {
    try {
      // let dataRedis = await client.get("allReplies");
      const idSpace = parseInt(id);

      // const spaceId = await this.SpaceRepository.findOne({
      //   where: { id: idSpace },
      // });
      // if (!dataRedis) {
      const allReplies = await this.RepliesRepository.find({
        where: {
          spaces: { id: idSpace },
        },
        relations: {
          user: true,
        },
        order: { id: "DESC" },
      });

      const total_Replies = allReplies.length;
      // let dataString = JSON.stringify(allReplies);
      // dataRedis = dataString;
      // await client.set("allReplies", dataRedis);
      // }

      // const allReplies = await this.RepliesRepository.createQueryBuilder(
      //   "reply"
      // )
      //   .leftJoinAndSelect("reply.user", "user")
      //   .leftJoinAndSelect("reply.spaces", "spaces")
      //   .where("spaces.id = :idSpace", { idSpace })
      //   .orderBy("reply.id", "DESC")
      //   .getMany();

      // return JSON.parse(dataRedis);
      return { reply: allReplies, total_Replies: total_Replies };
      // return allReplies;
    } catch (error) {
      return {
        message: `Ooops something went wrong during get all reply by id, please see this ==>> ${error}`,
      };
    }
  }
})();

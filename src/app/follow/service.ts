import { Repository } from "typeorm";
import { Follow } from "../../entities/Follow";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";

export default new (class FollowService {
  private readonly FollowRepository: Repository<Follow> =
    AppDataSource.getRepository(Follow);
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);
  async getAll(): Promise<object | string> {
    try {
      const data = await this.FollowRepository.createQueryBuilder("follow")
        .leftJoinAndSelect("follow.follower", "follower")
        .leftJoinAndSelect("follow.following", "following")
        .getMany();

      return data;
    } catch (error) {
      return {
        message: `Ooops something went wrong, please see this ==>> ${error}`,
      };
    }
  }

  async getDetail(id: any): Promise<object | string> {
    try {
      const followDetail = await this.FollowRepository.createQueryBuilder(
        "follow"
      )
        .leftJoinAndSelect("follow.follower", "follower")
        .leftJoinAndSelect("follow.following", "following")
        .where("follow.id = :id", { id })
        .getOne();

      return followDetail;
    } catch (error) {
      return {
        message: `Ooops something went wrong, please see this ==>> ${error}`,
      };
    }
  }

  async getDetailFollow(id: any): Promise<object | string> {
    try {
      const response = await this.FollowRepository.find({
        where: {
          id,
        },
      });
      return response;
    } catch (error) {
      return {
        message: `Ooops something went wrong during getdetailfollow, please see this ==>> ${error}`,
      };
    }
  }

  async unFollow(id: any): Promise<object | string> {
    try {
      await this.FollowRepository.delete(id);

      return { message: `unfollowed` };
    } catch (error) {
      return {
        message: `Ooops something went error during remove follow, please see this ==>> ${error}`,
      };
    }
  }

  async follow(data: any): Promise<object | string> {
    try {
      const following = data.followingId;
      const follower = data.followerId;

      const followingId = await this.UserRepository.findOne({
        where: { id: following },
      });

      const followerId = await this.UserRepository.findOne({
        where: { id: follower },
      });

      const followed = await this.FollowRepository.findOne({
        where: {
          following: { id: following },
          follower: { id: follower },
        },
      });

      if (followed) {
        await this.FollowRepository.delete(followed.id);
        return {
          message: `Unfollowed!`,
        };
      }

      const newFollow = this.FollowRepository.create({
        ...data,
        follower: followerId,
        following: followingId,
      });

      // following is the one who follows someone, while followers is the one who being followed or target

      const response = await this.FollowRepository.save(newFollow);

      return {
        response,
        message: `Liked`,
      };
    } catch (error) {
      return {
        message: `Ooops something went error during follow, please see this ==>> ${error}`,
      };
    }
  }
})();

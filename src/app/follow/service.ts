import { Repository } from "typeorm";
import { Follow } from "../../entities/Follow";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";

export default new (class FollowService {
  private readonly FollowRepository: Repository<Follow> =
    AppDataSource.getRepository(Follow);
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async getDetailFollowing(id: any): Promise<object | string> {
    try {
      const follow = await this.FollowRepository.find({
        where: {
          following: { id: id },
        },
        relations: {
          follower: true,
          following: true,
        },
      });
      const status = "Unfollow";

      const following = follow.map((follow) => ({ ...follow, status }));

      return following;
      // follower,
    } catch (error) {
      return {
        message: `Ooops something went wrong during getdetailfollowing, please see this ==>> ${error}`,
      };
    }
  }

  async getDetailFollower(id: any): Promise<object | string> {
    try {
      const follower = await this.FollowRepository.find({
        where: {
          follower: { id: id },
        },
        relations: {
          following: true,
        },
      });

      return follower;
      // follower,
    } catch (error) {
      return {
        message: `Ooops something went wrong during getdetailfollower, please see this ==>> ${error}`,
      };
    }
  }
  async getOtherDetailFollowing(id: any): Promise<object | string> {
    try {
      const following = await this.FollowRepository.find({
        where: {
          following: { id: id },
        },
        relations: {
          follower: true,
        },
      });

      return following;
      // follower,
    } catch (error) {
      return {
        message: `Ooops something went wrong during getdetailfollowing, please see this ==>> ${error}`,
      };
    }
  }

  async getOtherDetailFollower(id: any): Promise<object | string> {
    try {
      const follower = await this.FollowRepository.find({
        where: {
          follower: { id: id },
        },
        relations: {
          following: true,
        },
      });

      return follower;
      // follower,
    } catch (error) {
      return {
        message: `Ooops something went wrong during getdetailfollower, please see this ==>> ${error}`,
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
        message: `Followed`,
      };
    } catch (error) {
      return {
        message: `Ooops something went error during follow, please see this ==>> ${error}`,
      };
    }
  }
})();

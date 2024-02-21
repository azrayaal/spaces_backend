import { Repository } from "typeorm";
import { Follow } from "../../entities/Follow";
import { AppDataSource } from "../../data-source";

export default new (class FollowService {
  private readonly FollowRepository: Repository<Follow> =
    AppDataSource.getRepository(Follow);
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
})();

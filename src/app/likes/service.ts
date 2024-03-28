import { Repository } from "typeorm";
import { Likes } from "../../entities/Likes";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import { Spaces } from "../../entities/Space";

export default new (class LikeService {
  private readonly LikeRepository: Repository<Likes> =
    AppDataSource.getRepository(Likes);
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);
  private readonly SpaceRepository: Repository<Spaces> =
    AppDataSource.getRepository(Spaces);

  async like(data: any): Promise<object | string> {
    try {
      const userId = data.userId;
      const spacesId = data.spacesId;

      const user = await this.UserRepository.findOne({
        where: { id: userId },
      });

      const space = await this.SpaceRepository.findOne({
        where: { id: spacesId },
      });

      const liked = await this.LikeRepository.findOne({
        where: {
          user: { id: userId },
          spaces: { id: spacesId },
        },
      });

      if (liked) {
        await this.LikeRepository.delete(liked.id);
        return {
          message: `Unliked`,
        };
      }

      const like = this.LikeRepository.create({
        ...data,
        user,
        spaces: space,
      });

      await this.LikeRepository.save(like);
      return {
        message: `Liked`,
        // like,
      };
    } catch (error) {
      return {
        message: `Ooops something went error during like, please see this ==>> ${error}`,
      };
    }
  }
})();

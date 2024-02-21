import { Repository } from "typeorm";
import { Likes } from "../../entities/Likes";
import { AppDataSource } from "../../data-source";

export default new (class LikeService {
  private readonly LikerRepository: Repository<Likes> =
    AppDataSource.getRepository(Likes);

  async like(id: any): Promise<object | string> {
    try {
      const response = await this.LikerRepository.create(id);
      return {
        response,
        message: `Liked`,
      };
    } catch (error) {
      return {
        message: `Ooops something went error during like, please see this ==>> ${error}`,
      };
    }
  }
})();

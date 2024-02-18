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
        .select([
          "spaces.id",
          "spaces.content",
          "spaces.image",
          "user.id",
          "full_name",
          "username",
          "email",
          "profile_picture",
          "profile_description",
        ])
        .orderBy("spaces.id", "DESC")
        // .getCount();
        .getRawMany();

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

      console.log("data create", { ...data, user: user });

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

  async delete(id: any): Promise<object | string> {
    try {
      const checkId = await this.SpacesRepository.findOne({ where: { id } });
      if (!checkId) {
        return { message: `Ooops SpaceS can't be found` };
      }

      const deleteSpaces = await this.SpacesRepository.delete(id);

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

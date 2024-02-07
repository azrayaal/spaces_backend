import { Repository } from "typeorm";
import { Spaces } from "../../entities/Space";
import { AppDataSource } from "../../data-source";

export default new (class SpacesServices {
  private readonly SpacesRepository: Repository<Spaces> =
    AppDataSource.getRepository(Spaces);

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
      // const userId = data.userId;
      const userId = 1;

      const spaces = await this.SpacesRepository.findOne({
        where: { id: userId },
      });

      const newSpaces = this.SpacesRepository.create({
        ...data,
        spaces: spaces,
      });
      const response = await this.SpacesRepository.save(newSpaces);

      // const response = await this.SpacesRepository.save(data);
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
})();

// const candidate = await this.CandidateRepository.createQueryBuilder('candidate')
// .leftJoinAndSelect('candidate.party', 'party')
// .select(['candidate.id', 'candidate.name', 'candidate.image', 'candidate.vision_mission',
// 'party.id as partyId', 'party.name as partyName'])
// .getRawMany()

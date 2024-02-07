import { Repository } from "typeorm";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";

export default new (class UserServices {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async getAll(): Promise<object | string> {
    try {
      const data = await this.UserRepository.find();
      return data;
    } catch (error) {
      return {
        message: `Ooops something went wrong, please see this ==>> ${error}`,
      };
    }
  }

  async create(): Promise<object | string> {
    try {
    } catch (error) {
      return {
        message: `Ooops something went wrong during create new user, pkease see this ==>> ${error}`,
      };
    }
  }
})();

// export default new class ProvinceServices {
//   private readonly ProvinceRepository: Repository<Province> = AppDataSource.getRepository(Province)

//   async getAll(): Promise<object | string>{
//       try {
//          const allProvince = await this.ProvinceRepository.find()
//           return allProvince
//       } catch (error) {
//           return {message: `Message: Ooops something went error, please see this ==> ${error}`}
//       }
//   }

//   async create(data: any) : Promise<object | string> {
//       try {
//           const response = await this.ProvinceRepository.save(data)

//           return {
//               message: "Success!! new Province has been added!!",
//               data: response
//           }
//       } catch (error) {
//          return {message: `Message: Ooops something went error, please see this ==> ${error}`}
//       }
//   }

//   async getById(id: any): Promise<object | String> {
//       try {
//           const getProvinceById = await this.ProvinceRepository.findOne({ where: { id } })

//           if (getProvinceById) {
//               return getProvinceById;
//             } else {
//               return {
//                 message: 'Province not found',
//               };
//             }
//       } catch (error) {
//           return {
//               message: `Ooops something went wrong ${error}`
//           }
//       }
//   }

//   async updateById(id: any, data: any): Promise<object | string> {
//       try {
//           const dataProvince = await this.ProvinceRepository.findOne({ where: { id } })

//           if (!dataProvince){
//               return {
//                   message: `Data Province with ${id} cannot be found`
//               }
//           }

//           const updateProvice = await this.ProvinceRepository.save({
//               ...dataProvince,
//               ...data
//           })

//           return {
//               message: "Success!! new Province has been Updated!!",
//               data: updateProvice
//           }

//       } catch (error) {
//           return {
//               message: `Message: Ooops something went error, please see this ==> ${error}`
//           }
//       }
//   }

//   async deleteProvince(id:any): Promise<object | string> {
//       try {
//           const deleteProvince = await this.ProvinceRepository.delete(id)

//           if (!deleteProvince) {
//               return {
//                   message: `Province with ID ${id} cannot be found`
//               }
//           }

//           return {
//               message: "Success!! Province has been Deleted!!",
//           }
//       } catch (error) {
//           return {
//               message: `Message: Ooops something went error, please see this ==> ${error}`
//           }
//       }
//   }

// }

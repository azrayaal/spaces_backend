import { Repository } from "typeorm";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export default new (class UserServices {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async register(data: any) {
    try {
      // CHECK EMAIL
      const checkEmail = await this.UserRepository.count({
        where: { email: data.email },
      });
      if (checkEmail > 0) {
        return `${data.email} has been registered`;
      }
      // HASHING PASSWORD
      const hashPasword = await bcrypt.hash(data.password, 10);

      const obj = this.UserRepository.create({
        username: data.username,
        full_name: data.full_name,
        email: data.email,
        password: hashPasword,
        profile_picture: data.profile_picture,
        profile_description: data.profile_description,
      });

      const response = await this.UserRepository.save(obj);

      return {
        message: `Success!, new User has been added!`,
        response,
      };
    } catch (error) {
      return {
        message: `Ooops something went wrong during register, please see this ==>> ${error}`,
      };
    }
  }

  async logIn(data: any) {
    try {
      const checkEmail = await this.UserRepository.findOne({
        where: { email: data.email },
      });
      if (!checkEmail) {
        return `${data.email} has been not registered`;
      }

      const comparePassword = await bcrypt.compare(
        data.password,
        checkEmail.password
      );
      if (!comparePassword) {
        return `Password is wrong!!`;
      }

      const obj = this.UserRepository.create({
        id: checkEmail.id,
        email: checkEmail.email,
        password: checkEmail.password,
      });

      const token = jwt.sign({ obj }, "secretkey", { expiresIn: "1h" });
      return { message: `Login Success!`, token };
    } catch (error) {
      return {
        message: `Ooops something went error during Log In, please see this ${error}`,
      };
    }
  }

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

  async create(data: any): Promise<object | string> {
    try {
      const response = await this.UserRepository.save(data);
      return {
        response,
        message: "New User has been added",
      };
    } catch (error) {
      return {
        message: `Ooops something went wrong during create new user, please see this ==>> ${error}`,
      };
    }
  }
})();

// export default new class ProvinceServices {
//   private readonly ProvinceRepository: Repository<Province> = AppDataSource.getRepository(Province)

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

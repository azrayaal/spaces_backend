import { v2 as cloudinary } from "cloudinary";
// const cloudinary = require('cloudinary');

export default new (class CloudinaryConfig {
  upload() {
    cloudinary.config({
      cloud_name: "ddpo1vjim",
      api_key: "238166965551687",
      api_secret: "QhQ-jg00oz4pSB0Q4Wq_gujczWY",
      secure: true,
    });
  }
  async destination(image: string): Promise<any> {
    try {
      return await cloudinary.uploader.upload(`src/uploads/${image}`, {
        // resource_type: "auto",
        overwrite: true,
      });
    } catch (error) {
      throw error;
    }
  }
})();

// import { v2 as cloudinary } from "cloudinary";

// class CloudinaryConfig {
//   upload() {
//     cloudinary.config({
//       cloud_name: "ddpo1vjim",
//       api_key: "238166965551687",
//       api_secret: "QhQ-jg00oz4pSB0Q4Wq_gujczWY",
//       secure: true,
//     });
//   }

//   async destination(image: string): Promise<any> {
//     try {
//       return await cloudinary.uploader.upload(`src/uploads/${image}`, {
//         overwrite: true,
//       });
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// const cloudinaryConfig = new CloudinaryConfig();
// cloudinaryConfig.upload(); // tambahkan pemanggilan fungsi upload()

// export default cloudinaryConfig;

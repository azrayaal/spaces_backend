import { v2 as cloudinary } from "cloudinary";

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
      const filename = image.split("/").pop();
      return await cloudinary.uploader.upload(`src/uploads/${image}`, {
        public_id: filename,
        overwrite: true,
        folder: "SpaceS",
      });
    } catch (error) {
      throw error;
    }
  }
})();

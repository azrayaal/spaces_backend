import * as express from "express";
import * as multer from "multer";

export default new (class uploadImage {
  upload(fieldName: string) {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./src/uploads");
      },
      filename: (req, file, cb) => {
        const filenameWithoutExtension = file.originalname
          .split(".")
          .slice(0, -1)
          .join(".");
        cb(null, `${filenameWithoutExtension}-${Date.now()}.png`);
      },
    });

    const uploadFile = multer({ storage });

    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      // uploadFile.array(fieldName, 2)(req, res, (error: any) => {
      //   if (error) {
      //     console.error(`Multer Error: ${error}`);
      //     return res.status(400).json({
      //       message: `Ooops something went error when you upload image, please see this ==>> ${error}`,
      //     });
      //   }

      //   if (req.file) {
      //     res.locals.filename = req.file.filename;
      //   }
      uploadFile.single(fieldName)(req, res, (error: any) => {
        if (error) {
          console.error(`Multer Error: ${error}`);
          return res.status(400).json({
            message: `Ooops something went error when you upload image, please see this ==>> ${error}`,
          });
        }

        if (req.file) {
          res.locals.filename = req.file.filename;
        }
        next();
      });
    };
  }
})();
// import * as express from "express";
// import * as multer from "multer";

// export default new (class uploadImage {
//   upload(fieldName: string) {
//     const storage = multer.diskStorage({
//       destination: (req, file, cb) => {
//         cb(null, "./src/uploads");
//       },
//       filename: (req, file, cb) => {
//         const filenameWithoutExtension = file.originalname
//           .split(".")
//           .slice(0, -1)
//           .join(".");
//         cb(null, `${filenameWithoutExtension}-${Date.now()}.png`);
//       },
//     });

//     const uploadFile = multer({ storage });

//     return (
//       req: express.Request,
//       res: express.Response,
//       next: express.NextFunction
//     ) => {
//       uploadFile.array(fieldName, 2)(req, res, (error: any) => {
//         if (error) {
//           console.error(`Multer Error: ${error}`);
//           return res.status(400).json({
//             message: `Ooops something went error when you upload image, please see this ==>> ${error}`,
//           });
//         }

//         if ((req as any).files && Array.isArray((req as any).files)) {
//           res.locals.filenames = (req as any).files.map(
//             (file: Express.Multer.File) => file.filename
//           );
//         }
//         next();
//       });
//     };
//   }
// })();

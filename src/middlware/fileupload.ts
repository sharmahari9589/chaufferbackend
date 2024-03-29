import multer from 'multer';
import path from  "path" ;


export const storage = multer.diskStorage({
  
  
    destination: (req, file, cb) => {

      cb(null, './public'); 
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname+ '_'+Date.now()+ path.extname(file.originalname)); 
    }
  });


  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      // if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      //   return cb(new Error('Only image files are allowed!'));
      // }
      cb(null, true);
    }
  });
  


export default upload;

// export const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//       fileSize: 10 * 1024 * 1024, // No larger than 10mb
//       fieldSize: 10 * 1024 * 1024, // No larger than 10mb
//   },
// });


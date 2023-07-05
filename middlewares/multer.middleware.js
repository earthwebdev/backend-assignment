import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' +  file.originalname )
    }
  });
  
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        cb(new Error('Wrong extension type'), false);
        //return cb(null, false, 'Wrong extension type');
        //return cb('Wrong extension type', false);
    }
    cb(null, true);
}

export const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 2 * 1024 *1024   //not more than 2Mb
    }
})
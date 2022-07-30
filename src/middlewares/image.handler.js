import { v4 as uuid } from 'uuid';
import multer from 'multer';
import path from 'path';

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, './uploads/');
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        // cb(null, uuid() + file.originalname);
        cb(null, uuid() + path.extname(file.originalname));
    }
});

export const imageHandler = multer({ storage: storage });



import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// 1. Настройка аккаунта (данные возьмешь из Dashboard Cloudinary)
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_NAME,
   api_key: process.env.CLOUDINARY_KEY,
   api_secret: process.env.CLOUDINARY_SECRET,
});

// 2. Настройка хранилища
const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
   params: async (req, file) => {
      // Мы можем передавать имя папки в теле запроса (req.body) 
      // или определять по адресу (req.path)
      let folderName = 'general';

      if (req.originalUrl.includes('products')) folderName = 'products';
      if (req.originalUrl.includes('users')) folderName = 'avatars';
      if (req.originalUrl.includes('blogs')) folderName = 'blogs';

      return {
         folder: folderName,
         allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
         public_id: Date.now() + '-' + file.originalname.split('.')[0],
      };
   },
});


// 3. Инициализация Multer
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

export default upload;
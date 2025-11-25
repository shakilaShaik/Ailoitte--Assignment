import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.v2.uploader.upload_stream({ folder: 'ecommerce' }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(file.buffer).pipe(upload_stream);
  });
}

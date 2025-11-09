import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';

// Configure Cloudinary
// Support both CLOUDINARY_URL and individual env vars
if (process.env.CLOUDINARY_URL) {
  // Parse CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
  const url = new URL(process.env.CLOUDINARY_URL);
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Memory storage for multer
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Helper function to upload to Cloudinary
export const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'wastemap',
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

export default cloudinary;

import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { v2 as cloudinary } from 'cloudinary';

// Lazy initialization of Cloudinary
let cloudinaryInitialized = false;

const initCloudinary = () => {
  if (!cloudinaryInitialized) {
    if (!process.env.CLOUDINARY_URL) {
      console.warn('CLOUDINARY_URL is missing. Uploads will be mocked.');
    } else {
      // Cloudinary automatically configures itself if CLOUDINARY_URL is present
      cloudinaryInitialized = true;
    }
  }
};

export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    initCloudinary();

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (!process.env.CLOUDINARY_URL) {
      // Mock upload if no Cloudinary URL
      return res.json({ url: `https://picsum.photos/seed/${req.user!.id}/800/600` });
    }

    // Upload to Cloudinary using a stream
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'golf-charity',
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

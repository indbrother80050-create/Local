import { Router } from 'express';
import { uploadImage } from './upload.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/image', authenticate, upload.single('image'), uploadImage);

export default router;

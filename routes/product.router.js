import express from 'express';
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

import { createProduct } from '../controllers/products.controller.js';


const router = express.Router();

router.post('/', authMiddleware, authorize('ADMIN'),
                upload.fields([{
                    name: 'thumbnail', maxCount: 1
                }, {
                    name: 'photos', maxCount: 12
                }]),
                createProduct); //upload.single('thumbnail'), upload.array('photos', 12),

export default router;
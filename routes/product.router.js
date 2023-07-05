import express from 'express';
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

import { getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js';


const router = express.Router();

router.get('/', authMiddleware, getProduct);
router.post('/', authMiddleware, authorize('ADMIN'),
                upload.fields([{
                    name: 'thumbnail', maxCount: 1
                }, {
                    name: 'photos', maxCount: 12
                }]),
                createProduct); //upload.single('thumbnail'), upload.array('photos', 12),
router.patch('/:id', authMiddleware, authorize('ADMIN'), updateProduct);
router.delete('/:id', authMiddleware, authorize('ADMIN'), deleteProduct);


export default router;
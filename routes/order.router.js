import express from 'express';
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';
import { getOrder, createOrder } from '../controllers/orders.controller.js';

const router = express.Router();

router.get('/', authMiddleware, authorize('USER'), getOrder);
router.post('/', authMiddleware, authorize('USER'), createOrder);

export default router;
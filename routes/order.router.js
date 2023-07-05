import express from 'express';
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';
import { createOrder } from '../controllers/orders.controller.js';

const router = express.Router();

router.post('/', authMiddleware, authorize('USER'), createOrder)

export default router;
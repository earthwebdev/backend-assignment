import express from 'express';
import userRouter from './user.router.js';
import productRouter from './product.router.js';
import orderRouter from './order.router.js';
import reportingRouter from './reporting.router.js';
import swaggerRouter from './swagger.router.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);

router.use('/reports', reportingRouter);

router.use('/swagger', swaggerRouter);


export default router;
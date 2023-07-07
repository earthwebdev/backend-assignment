import express from 'express';
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';
import { getOrder, createOrder, deleteOrder } from '../controllers/orders.controller.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - paymentId
 *         - total
 *       properties:
 *         id:
 *           type: int
 *           description: The auto-generated id of the order
 *         paymentId:
 *           type: int
 *           description: The paymentId of your order
 *         total:
 *           type: string
 *           description: The total of your order
 *         userId:
 *           type: int
 *           description: The user Id of your order
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated date of the order
 *       example:
 *         id: d5fE_asz
 *         paymentId: 2
 *         total: 110.20
 *         userId: 2
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - total
 *         - provider
 *         - status
 *       properties:
 *         id:
 *           type: int
 *           description: The auto-generated id of the order payment
 *         total:
 *           type: float
 *           description: The total of your order payment
 *         provider:
 *           type: string
 *           description: The provider of your order payment
 *         status:
 *           type: string
 *           description: The status of your order payment
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated date of the order payment
 *       example:
 *         id: d5fE_asz
 *         total: 110.20
 *         provider: stripe
 *         status: pending
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItems:
 *       type: object
 *       required:
 *         - orderId
 *         - productId
 *         - price
 *         - quantity
 *         - total
 *       properties:
 *         id:
 *           type: int
 *           description: The auto-generated id of the order payment
 *         orderId:
 *           type: int
 *           description: The id of your order 
 *         productId:
 *           type: int
 *           description: The id of your product
 *         price:
 *           type: float
 *           description: The price of your product
 *         quantity:
 *           type: int
 *           description: The quantity of your product
 *         total:
 *           type: float
 *           description: The total of your each product order
 *         discountPercentage:
 *           type: float
 *           description: The discount Percentage of your each product
 *         discountedPrice:
 *           type: float
 *           description: The discounted Price of your each product order
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated date of the order payment
 *       example:
 *         id: d5fE_asz
 *         orderId: d5fE_asz
 *         productId: d5fE_asz
 *         price: 250
 *         quantity: 4
 *         total: 100
 *         discountPercentage: 20
 *         discountedPrice: 80
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

const router = express.Router();

router.get('/', authMiddleware, authorize('USER'), getOrder);
router.post('/', authMiddleware, authorize('USER'), createOrder);

router.delete('/:id', authMiddleware, authorize('ADMIN'), deleteOrder);

export default router;
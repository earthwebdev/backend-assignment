import express from 'express';
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

import { getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - stock
 *         - brand
 *         - category
 *         - thumbnail
 *         - photos
 *       properties:
 *         id:
 *           type: int
 *           description: The auto-generated id of the product
 *         title:
 *           type: string
 *           description: The title of your product
 *         description:
 *           type: string
 *           description: The description of your product
 *         price:
 *           type: Float
 *           description: The price of your product
 *         discountPercentage:
 *           type: Float
 *           description: The discount percentage of your product
 *         stock:
 *           type: int
 *           description: The quantity stock of your product
 *         brand:
 *           type: string
 *           description: The brand of your product
 *         category:
 *           type: enum
 *             - smartphones
 *             - laptops
 *             - fragrances
 *             - skincare
 *             - groceries
 *             - homedecoration
 *             - furniture
 *             - tops
 *             - womensdresses
 *             - womensshoes
 *             - mensshirts
 *             - mensshoes
 *             - menswatches
 *             - womenswatches
 *             - womensbags
 *             - womensjewellery
 *             - sunglasses
 *             - automotive
 *             - motorcycle
 *             - lighting
 *           description: The category of your product
 *         thumbnail:
 *           type: string
 *           format: binary
 *           description: The thumbnail image of your product
 *         photos:
 *           type: string
 *           format: binary
 *           description: The images of your product
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated date of the product
 *       example:
 *         id: d5fE_asz
 *         title: The New product
 *         description: The new product description
 *         price: 250.00
 *         discountPercentage: 14.50
 *         stock: 100
 *         brand: apple
 *         category: smartphones
 *         thumbnail: abcd.jpg
 *         photos: abcd.jpg
 *         createdAt: 2020-03-10T04:05:06.157Z
 */
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The sales managing API for products
 * /products:
 *   get:
 *     summary: Lists all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The created product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 *   patch:
 *    summary: Update the product by the id
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product id
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *        description: Product created successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Product creation failed
 *      401:
 *        description: You are not authorized to access this resource.
 * /products/{id}:
 *   delete:
 *     summary: Remove the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       401:
 *        description: You are not authorized to access this resource. 
 *       404:
 *         description: No product found.
 */

router.get('/', authMiddleware, getProduct);
router.post('/', authMiddleware, authorize('ADMIN'),
                upload.fields([{
                    name: 'thumbnail', maxCount: 1
                }, {
                    name: 'photos', maxCount: 12
                }]),
                createProduct); //upload.single('thumbnail'), upload.array('photos', 12),
router.patch('/:id', authMiddleware, authorize('ADMIN'), upload.fields([{
                    name: 'thumbnail', maxCount: 1
                }, {
                    name: 'photos', maxCount: 12
                }]), updateProduct);
router.delete('/:id', authMiddleware, authorize('ADMIN'), deleteProduct);


export default router;
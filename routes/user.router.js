import express from 'express';
import { registerUsers, loginUsers, profileUsers } from '../controllers/users.controller.js'
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullname
 *         - role
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: int
 *           description: The auto-generated id of the user
 *         fullname:
 *           type: string
 *           description: The fullname of your user
 *         age:
 *           type: int
 *           description: The age of your user
 *         phone:
 *           type: string
 *           description: The phone of your user
 *         gender:
 *           type: enum
 *             - Male
 *             - Female
 *             - Others
 *           description: The gender of your user
 *         role:
 *           type: enum
 *             - USER
 *             - ADMIN
 *           description: The role of your user
 *         address:
 *           type: string
 *           description: The address of your user
 *         email:
 *           type: string
 *           description: The email of your user
 *         password:
 *           type: string
 *           description: The password of your user
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated date of the user
 *       example:
 *         id: d5fE_asz
 *         fullname: The new user
 *         age: 25
 *         phone: "9841123456"
 *         gender: Male
 *         role: USER
 *         address: kathmandu nepal
 *         email: yourname@email.com
 *         password: abcdef123!
 *         createdAt: 2020-03-10T04:05:06.157Z
 */
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The sales managing API for user
 * /users/profileme:
 *   get:
 *     summary: Lists all the products
 *     tags: [Users]
 *     parameters:
 *       - 
 *         name: authorization
 *         in: header
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The data of own user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * /users/register: 
 *   post:
 *     summary: register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully..
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User has already registed.
 *       404:
 *         description: User must have fullname, email and password.
 * /users/login: 
 *   post:
 *    summary: the user login by the email and password
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: Users login succcessfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      400:
 *        description: Please provide the correct email and password
 *      401:
 *        description: You are not authorized to access this resource.
 *      404:
 *        description: Please enter email and password.
 */
router.post('/login', loginUsers);
router.post('/register', registerUsers);

router.get('/profileme', authMiddleware, profileUsers); //authorize('ADMIN'),

export default router;
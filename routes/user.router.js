import express from 'express';
import { registerUsers, loginUsers, profileUsers } from '../controllers/users.controller.js'
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', loginUsers);
router.post('/register', registerUsers);

router.get('/profileme', authMiddleware, profileUsers); //authorize('ADMIN'),

export default router;
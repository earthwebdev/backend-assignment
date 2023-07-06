import express from 'express'
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';
import { reporting } from '../controllers/reporting.controller.js';

const router = express.Router();

router.get('/days', authMiddleware, authorize('ADMIN'), reporting);
router.get('/weeks', authMiddleware, authorize('ADMIN'), reporting);
router.get('/months', authMiddleware, authorize('ADMIN'), reporting);

router.get('/differencdate', authMiddleware, authorize('ADMIN'), reporting);

export default router;
import express from 'express';
import { registerUsers } from '../controllers/users.controller.js'

const router = express.Router();


router.post('/', registerUsers);

export default router;
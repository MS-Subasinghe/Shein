import express from 'express';
import { getAllUsers, getUsersCount } from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/count', verifyToken, isAdmin, getUsersCount);

export default router;

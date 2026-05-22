import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('ADMIN'), getUsers);

export default router;

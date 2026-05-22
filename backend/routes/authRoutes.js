import express from 'express';
import { login, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { loginRules, registerRules } from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);
router.get('/me', protect, me);

export default router;

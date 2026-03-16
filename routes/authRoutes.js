import express from 'express';
import {
  registerAdmin,
  loginUser,
  logoutUser,
  updatePassword,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// გამოიყენე ერთხელ ადმინის შესაქმნელად, შემდეგ წაშალე ეს სტრიქონი
router.post('/register', registerAdmin);

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/update-password', protect, admin, updatePassword);

export default router;

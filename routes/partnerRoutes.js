import express from 'express';
import {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
} from '../controllers/partnerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getPartners);
router.get('/:id', getPartnerById);
router.post('/', protect, admin, upload.single('image'), createPartner);
router.put('/:id', protect, admin, upload.single('image'), updatePartner);
router.delete('/:id', protect, admin, deletePartner);

export default router;

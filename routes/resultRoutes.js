import express from 'express';
import {
  getResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult,
} from '../controllers/resultController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Result-ს სჭირდება რამდენიმე ფაილის ველი ერთდროულად
const resultUpload = upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);

router.get('/', getResults);
router.get('/:id', getResultById);
router.post('/', protect, admin, resultUpload, createResult);
router.put('/:id', protect, admin, resultUpload, updateResult);
router.delete('/:id', protect, admin, deleteResult);

export default router;

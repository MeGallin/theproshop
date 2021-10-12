import express from 'express';
import { addOderItems, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').post(protect, addOderItems);
router.route('/:id').get(protect, getOrderById);

export default router;

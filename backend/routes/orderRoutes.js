import express from 'express';
import { addOderItems } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').post(protect, addOderItems);

export default router;

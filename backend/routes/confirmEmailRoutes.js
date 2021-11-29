import express from 'express';
import { updateConfirmEmail } from '../controllers/confirmEmailController.js';

const router = express.Router();
router.route('/verify/:id').get(updateConfirmEmail);

export default router;

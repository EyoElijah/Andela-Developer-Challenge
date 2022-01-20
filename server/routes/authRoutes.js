import express from 'express';
import {
  validateUserInput,
  validateLoginInput,
  handleValitaionError,
} from '../middleware/validation.js';
import { signUpController, loginController } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', validateUserInput, handleValitaionError, signUpController);
router.post('/login', validateLoginInput, handleValitaionError, loginController);

export default router;

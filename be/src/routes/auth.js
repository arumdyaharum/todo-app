import express from 'express';
import AuthController from '../controllers/auth.js';
import { validateUserRegistration, validateUserLogin } from '../validators/validator.js';
import handleValidationErrors from '../middleware/validation.js';

const router = express.Router();

router.post('/login', validateUserLogin, handleValidationErrors, AuthController.login);
router.post('/register', validateUserRegistration, handleValidationErrors, AuthController.register);

export default router;
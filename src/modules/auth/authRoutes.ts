import express from 'express'
import authController from './authController';

const router = express.Router();

router
  .route('/register')
  .post(authController.register);

router
  .route('/login')
  .post(authController.login);

router
  .route('/check-auth')
  .post(authController.checkAuth);

export default router
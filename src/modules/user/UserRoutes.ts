import express from 'express'
import UserController from '@src/modules/user/UserController';
import authGuardMid from '@src/middlewares/authGuardMid';
import { upload } from '@src/middlewares/fileUploadMid';

const router = express.Router();

router
  .route('/')
  .get(UserController.gets)

router
  .route('/:id')
  .get(UserController.get)

router
  .route('/')
  .post(UserController.create);

router
  .route('/:id')
  .put(upload.single('image'), UserController.update);

export default router
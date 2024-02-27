import express from 'express'
import LikeController from '@src/modules/like/LikeController';
import authGuardMid from '@src/middlewares/authGuardMid';
import { upload } from '@src/middlewares/fileUploadMid';

const router = express.Router();

router
  .route('/')
  .get(LikeController.gets)

router
  .route('/:id')
  .get(LikeController.get)

router
  .route('/')
  .post(LikeController.create);

router
  .route('/:id')
  .put(upload.single('image'), LikeController.update);

router
  .route('/:id')
  .delete(LikeController.delete);

export default router
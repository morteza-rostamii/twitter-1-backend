import express from 'express'
import HashtagController from '@src/modules/hashtag/HashtagController';
import authGuardMid from '@src/middlewares/authGuardMid';
import { upload } from '@src/middlewares/fileUploadMid';

const router = express.Router();

router
  .route('/')
  .get(HashtagController.gets)

router
  .route('/:id')
  .get(HashtagController.get)

router
  .route('/')
  .post(HashtagController.create);

router
  .route('/:id')
  .put(upload.single('image'), HashtagController.update);

router
  .route('/:id')
  .delete(HashtagController.delete);

export default router
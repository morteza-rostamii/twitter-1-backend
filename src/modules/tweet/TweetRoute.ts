import express from 'express'
import tweetsController from '@src/modules/tweet/TweetController';
import authGuardMid from '@src/middlewares/authGuardMid';
import { upload } from '@src/middlewares/fileUploadMid';

const router = express.Router();

router
  .route('/')
  .get(tweetsController.gets)

router
  .route('/:id')
  .get(tweetsController.get)

router
  .route('/')
  .post(upload.single('image'), tweetsController.create);

router
  .route('/:id')
  .put(upload.single('image'), tweetsController.update);

router
  .route('/:id')
  .delete(tweetsController.delete);

export default router
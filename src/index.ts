import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config();

// s3 file upload
//import * from '@src/configs/s3'

// connect to db
import db from './configs/db'
const instance = db;

// routers-------------
import usersRouter from '@src/modules/user/UserRoutes'
import authRouter from '@src/modules/auth/authRoutes'
import tweetRouter from '@src/modules/tweet/TweetRoute'

// variables-----------
const PORT = process.env.PORT || 3001;
const CLIENT_URL = 
  process.env.NODE_ENV === 'development' 
  ? process.env.CLIENT_URL_DEV || '' 
  : process.env.CLIENT_URL_PRO || ''; 

const app = express();

// middlewares---------

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [CLIENT_URL],
  credentials: true,
}));
app.use(express.urlencoded({extended: true}));

// routes

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/tweets', tweetRouter);

app.all('*', (req: Request, res: Response) => {
  return res.json({
    msg: 'no such route.'
  });
});

app.listen(PORT, () => {
  console.log(`node server is running at: ${PORT}`);
});

console.log('hello');
import AWS from 'aws-sdk'
import { S3Client } from '@aws-sdk/client-s3';
import { Request, Response } from 'express';
import multer from 'multer'
import multerS3 from 'multer-s3'

// const config = {
//   endpoint: process.env.LIARA_ENDPOINT,
//   accesskeyId: process.env.LIARA_ACCESS_KEY,
//   secretAccessKey: process.env.LIARA_SECRET_KEY,
//   region: 'default',
// };

const s3Config = new S3Client({
  region: 'default',
  endpoint: process.env.LIARA_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY || '',
    secretAccessKey: process.env.LIARA_SECRET_KEY || '',
  },
});

//const s3 = new AWS.S3(config);

// multer setup
export const upload = multer({
  storage: multerS3({
    s3: s3Config, 
    bucket: process.env.LIARA_BUCKET_NAME || '',
    key: function (req:Request, file:any, cb:any) {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
});


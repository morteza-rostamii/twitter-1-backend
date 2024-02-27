
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import fs from 'fs'
import util from 'util'

const client = new S3Client({
  region: 'default',
  endpoint: process.env.LIARA_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY || '',
    secretAccessKey: process.env.LIARA_SECRET_KEY || '',
  },
});

const fileName = 'nature.jpg';
const filePath = `./public/${fileName}`;
const fileContent = fs.readFileSync(filePath);

export function downloadS3Url():void {
  // get the file url and store in mongo
  const params = {
    Bucket: process.env.LIARA_BUCKET_NAME || '',
    Key: fileName,
  };

  console.log('get--image--url');
  const command = new GetObjectCommand(params);
  getSignedUrl(client, command)
    .then((url:any) => {
      console.log(url);
    });
}

export function uploadToS3() {

  const params = {
    Body: fileContent,
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key: fileName,
  };
  
  // callback
  client.send(new PutObjectCommand(params), (error:any, data:any) => {
    if (error) {
      console.log(error?.message || error);
    }
    else {
      console.log(data);
  
      downloadS3Url();
    }
  });
}
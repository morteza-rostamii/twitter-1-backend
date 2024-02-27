import { Request, Response } from "express";
import Tweet from "./TweetModel";
import User from "../user/UserModel";
import TweetService from "./TweetService";
//import { uploadToS3 } from "@src/configs/s3";

const tweetsController = {
  // GET: /api/tweets
  async gets(req: Request, res: Response) {
    //console.log('--get tweets--');
    let {page, limit} = req.query;
    console.log(page, limit);
    if (!page) page = '1';
    if (!limit) limit = '5'
    const numPage:number = parseInt(page?.toString());
    const numLimit:number = parseInt(limit?.toString());

    
    try {
      
      const pagObj = await TweetService.getTweetsPginated({
        page: numPage,
        limit: numLimit,
      });


      //console.log('hell--', tweets)
      return res.status(200).json({
        status: true,
        results: {
          tweets: pagObj.tweets,
          hasNext: pagObj.hasNext,
          total: pagObj.total,
        },
      });
    }
    catch(error: any) {
      return res.status(400).json({
        status: false,
        error: error?.message || error,
      });
    }
  },

  // Get: /api/posts/:id
  
  async get(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const tweet = await Tweet.findOne({id: id}).exec();

      //uploadToS3();

      return res.status(200).json({
        status: true,
        results: {
          tweet,
        },
      });
    }
    catch(error: any) {
      return res.json({
        status: false,
        error: error?.message || error,
      });
    }
  },

  // POST: /api/tweets
  async create(req: Request, res: Response) {
    const {body, email} = req.body;
    const file = (req as any)?.file;

    //console.log(body, file.location, email);
    if (!body || !email) {
      return res.json({
        status: false,
        msg: 'bad input.',
        results: {},
      });
    }

    try {

      const user = await User.findOne({email});

      const newTweet = new Tweet({
        body,
        image: file.location,
        // tweet has one user
        user: user,
      });
      
      await newTweet.save();

      // user has many tweets
      user?.tweets.push(newTweet.id);
      await user?.save();

      return res.status(200).json({
        status: true,
        results: {
          tweet: newTweet.toObject(),
        },
      });
    }
    catch(error: any) {
      return res.status(500).json({
        status: false,
        error: error?.message || error,
      });
    }
  },

  
  async update(req: Request, res: Response) {
    const {id, username} = req.params;
    // uploaded file
    const file = (req as any)?.file; 

    console.log('uploaded-file--', file);

    try {
      const tweet = await Tweet.findOne({id: id}).exec();

      // update tweet 

      // store file in db

      return res.status(200).json({
        status: true,
        results: {
          tweet,
          file,
        },
      });
    }
    catch(error: any) {
      return res.json({
        status: false,
        error: error?.message || error,
      });
    }
  },

  
  async delete(req: Request, res: Response) {
    const {id} = req.params;

    console.log('delete-file--');

    try {
      const tweet = await Tweet.findOne({id: id}).exec();

      // update tweet 

      // store file in db

      return res.status(200).json({
        status: true,
        results: {
          tweet,
        },
      });
    }
    catch(error: any) {
      return res.json({
        status: false,
        error: error?.message || error,
      });
    }
  },
  
}

export default tweetsController;
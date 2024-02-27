import { Request, Response } from "express";
import User from "./LikeModel";
import { uploadToS3 } from "@src/configs/s3";

const postsController = {
  // GET: /api/posts
  async gets(req: Request, res: Response) {
    try {
      const posts = await User.find({}).exec();


      return res.status(200).json({
        status: true,
        results: {
          posts,
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

  // Get: /api/posts/:id
  async get(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const user = await User.findOne({id: id}).exec();

      //uploadToS3();

      return res.status(200).json({
        status: true,
        results: {
          user,
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

  // POST: /api/posts
  async create(req: Request, res: Response) {
    const {auth0Id, email, name} = req.body;

    if (!auth0Id || !email || !name) {
      return res.json({
        status: false,
        msg: 'bad input.',
        results: {},
      });
    }

    try {

      const oldUser = await User.findOne({
        auth0Id,
      });

      if (oldUser) {
        return res.status(200).json({
          status: true,
          msg: 'user already exists.',
          results: {},
        });
      }

      const newUser = new User({
        auth0Id,
        email,
        name,
      });
      await newUser.save();

      return res.status(200).json({
        status: true,
        results: {
          user: newUser.toObject(),
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
      const user = await User.findOne({id: id}).exec();

      // update user 

      // store file in db

      return res.status(200).json({
        status: true,
        results: {
          user,
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
      const user = await User.findOne({id: id}).exec();

      // update user 

      // store file in db

      return res.status(200).json({
        status: true,
        results: {
          user,
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

export default postsController;
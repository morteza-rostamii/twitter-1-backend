import { Request, Response } from "express";
import Hashtag from "./HashtagModel";
import { uploadToS3 } from "@src/configs/s3";

const hashtagsController = {
  // GET: /api/hashtags
  async gets(req: Request, res: Response) {
    try {
      const hashtags = await Hashtag.find({}).exec();


      return res.status(200).json({
        status: true,
        results: {
          hashtags,
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

  // Get: /api/hashtags/:id
  async get(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const hashtag = await Hashtag.findOne({id: id}).exec();

      //uploadToS3();

      return res.status(200).json({
        status: true,
        results: {
          Hashtag,
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

  // POST: /api/hashtags
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

      const oldHashtag = await Hashtag.findOne({
        auth0Id,
      });

      if (oldHashtag) {
        return res.status(200).json({
          status: true,
          msg: 'Hashtag already exists.',
          results: {},
        });
      }

      const newHashtag = new Hashtag({
        auth0Id,
        email,
        name,
      });
      await newHashtag.save();

      return res.status(200).json({
        status: true,
        results: {
          Hashtag: newHashtag.toObject(),
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
    const {id, Hashtagname} = req.params;
    // uploaded file
    const file = (req as any)?.file; 

    console.log('uploaded-file--', file);

    try {
      const hashtag = await Hashtag.findOne({id: id}).exec();

      // update Hashtag 

      // store file in db

      return res.status(200).json({
        status: true,
        results: {
          Hashtag,
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
      const hashtag = await Hashtag.findOne({id: id}).exec();

      // update Hashtag 

      // store file in db

      return res.status(200).json({
        status: true,
        results: {
          Hashtag,
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

export default hashtagsController;
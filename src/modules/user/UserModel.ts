import { NextFunction, Response } from "express";
import mongoose, { Schema } from "mongoose";
import Tweet from "../tweet/TweetModel";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
    trim: true,
  },
  
  // one to many
  tweets: [{
    type: Schema.Types.ObjectId, ref: 'Tweet',
  }],

  likes: [{
    type: Schema.Types.ObjectId, ref: 'Like',
  }],

  followers: [{
    type: Schema.Types.ObjectId, ref: 'User',
  }],
  follows: [{
    type: Schema.Types.ObjectId, ref: 'User',
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// delete all tweets on user delete
userSchema.pre("deleteOne", async function(next:any) {
  try {
    const userId = this.getQuery()._id;
    await Tweet.deleteMany({user: userId});
  }
  catch(error:any) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);


export default User;
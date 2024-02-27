import mongoose, { Schema } from "mongoose";

const tweetSchema = new mongoose.Schema({
  body: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true,
  },

  // many to one
  user: {
    type: Schema.Types.ObjectId, ref: 'User'
  },

  // many to many
  hashtags: [{
    type: Schema.Types.ObjectId, ref: 'Hashtag',
  }],

  likes: [{
    type: Schema.Types.ObjectId, ref: 'Like',
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

const Tweet = mongoose.model('Tweet', tweetSchema);

export default Tweet;
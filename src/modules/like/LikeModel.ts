import mongoose, { Schema } from "mongoose";

const likeSchema = new mongoose.Schema({
  
  // many to one
  user: {
    type: Schema.Types.ObjectId, ref: 'User'
  },

  // many to one
  tweet: {
    type: Schema.Types.ObjectId, ref: 'Tweet',
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const Like = mongoose.model('Like', likeSchema);

export default Like;
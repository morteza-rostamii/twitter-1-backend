import mongoose, { Schema } from "mongoose";

const hashtagsSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  // many to many
  posts: [{
    type: Schema.Types.ObjectId, ref: 'Post',
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

const Hashtag = mongoose.model('Hashtag', hashtagsSchema);

export default Hashtag;
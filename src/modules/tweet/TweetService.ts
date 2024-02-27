import { TGetTweetPaginated } from "@src/types/type";
import Tweet from "./TweetModel";

const TweetService = {

  async getTweetsPginated({
    page=1,
    limit=5,
  }: TGetTweetPaginated) {
    console.log('in--service--: ', page, limit);
    const tweets = await Tweet
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user')
      .sort({createdAt: -1})
      .exec();
    
    const totalTweets = await Tweet.countDocuments();

    const hasNext = totalTweets > page * limit;

    return {
      hasNext,
      tweets,
      total: totalTweets,
    };
  },
};

export default TweetService
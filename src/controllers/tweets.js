const ApiError = require('../utils/ApiError');
const { User, Tweet } = require('../database/models');
const TweetSerializer = require('../serializers/UserSerializer');
const TweetsSerializer = require('../serializers/UsersSerializer');

const findTweet = async (tweetId) => {
  const tweet = await User.findOne({ where: { id: tweetId, active: true } });
  if (!tweet) {
    throw new ApiError('User not found', 400);
  }
  return tweet;
};

const createTweet = async (req, res, next) => {
  try {
    const { body } = req;

    const tweetPayload = {
      text: body.text,
      likeCounter: 0,
      userId: req.user.id,
    };
    if (Object.values(tweetPayload).some((val) => val === undefined)) {
      throw new ApiError('Bad request', 400);
    }

    const tweet = await Tweet.create(tweetPayload);
    const user = await User.findUser(req.user.id);
    tweet.dataValues.user = user.dataValues;
    res.json(new TweetSerializer(tweet));
  } catch (err) {
    next(err);
  }
};

const getAllTweets = async (req, res, next) => {
  const where = {
    userId: req.user.id,
  };
  const TweetList = await Tweet.findAll(
    {
      where,
      ...req.pagination,
      include: [{
        attributes: ['id', 'text', 'likeCounter', 'tweetId', 'createdAt', 'updatedAt'],
      }],
    },
  );
  res.json(new TweetsSerializer(TweetList, await req.getPaginationInfo(Tweet)));
};

const getTweetById = async (req, res, next) => {
  try {
    const { params } = req;
    const tweet = await findTweet({ id: params.id });

    res.json(new TweetSerializer(tweet));
  } catch (err) {
    next(err);
  }
};

const likeTweet = async (req, res, next) => {
  try {
    const { params } = req;
    const tweet = await findTweet({ id: params.id });
    const updatedCounter = {
      likeCounter: tweet.dataValues.likeCounter + 1,
    };
    Object.assign(tweet, updatedCounter);
    const save = await tweet.save();
  } catch (err) {
    next(err);
  }
};

const deleteTweet = async (req, res, next) => {
  try {
    const { params } = req;
    const tweet = await findTweet({ id: params.id });

    if (!tweet) {
      const deletedTweet = await Tweet.destroy({ where: { id: params.id } });
      console.log(deletedTweet);
      res.json(new TweetSerializer(null));
    } else {
      throw new ApiError('Tweet not found', 400);
    }
  } catch (err) {
    next(err);
  }
};


module.exports = {
  findTweet,
  createTweet,
  getAllTweets,
  getTweetById,
  likeTweet,
  deleteTweet,
};

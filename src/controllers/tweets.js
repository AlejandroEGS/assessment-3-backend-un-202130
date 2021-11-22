const ApiError = require('../utils/ApiError');
const { User, Tweet, Comment } = require('../database/models');
const TweetSerializer = require('../serializers/UserSerializer');
const TweetsSerializer = require('../serializers/UsersSerializer');

const findTweet = async (tweetId) => {
  const tweet = await Tweet.findOne({ where: { id: tweetId, active: true } });
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
      throw new ApiError('Tweet not found', 400);
    } else {
      const deletedTweet = await Tweet.destroy({ where: { id: params.id } });
      console.log(deletedTweet);
      res.json(new TweetSerializer(null));
    }
  } catch (err) {
    next(err);
  }
};

const getFeedUsername = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findOne({ where: { username: params.username, active: true } });

    const Tweets = await Tweet.findAll({
      where: {
        userId: user.id,
      },
      ...req.pagination,
      include: [
        { model: User, attributes: ['id', 'name', 'username', 'email', 'createdAt', 'updatedAt', 'lastLoginDate'], as: 'user' },
        { model: Comment, attributes: ['id', 'text', 'likeCounter', 'tweetId', 'createdAt', 'updatedAt'], as: 'comments' },
      ],
    });
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
  getFeedUsername,
};

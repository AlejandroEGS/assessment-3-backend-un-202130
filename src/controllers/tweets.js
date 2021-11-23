const ApiError = require('../utils/ApiError');
const { User, Tweet, Comment } = require('../database/models');
const TweetSerializer = require('../serializers/UserSerializer');
const TweetsSerializer = require('../serializers/UsersSerializer');

const findTweet = async (body) => {
  const tweet = await Tweet.findOne({ where: body });
  if (!tweet) {
    throw new ApiError('User not found', 400);
  }
  return tweet;
};

const createTweet = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.text === undefined || req.user.id === undefined) {
      throw new ApiError('Payload must contain text', 400);
    }

    const tweet = await Tweet.create({
      text: body.text,
      userId: req.user.id,
      likeCounter: 0,
    });
    res.json(new TweetSerializer(tweet));
  } catch (err) {
    next(err);
  }
};

const getAllTweets = async (req, res, next) => {
  const TweetList = await Tweet.findAll(
    {
      where: {
        userId: req.user.id,
      },
      ...req.pagination,
      include: [
        { model: User },
        { model: Comment },
      ],
    },
  );
  res.json(new TweetsSerializer(TweetList, await req.getPaginationInfo(Tweet)));
};

const getTweetById = async (req, res, next) => {
  try {
    const { params } = req;
    const tweet = await findTweet({ params });

    res.json(new TweetSerializer(tweet));
  } catch (err) {
    next(err);
  }
};

const likeTweet = async (req, res, next) => {
  try {
    const { params } = req;
    const tweet = await findTweet({ params });
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
    const tweet = await findTweet({ params });

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
        { model: User },
        { model: Comment },
      ],
    });
    res.json(new TweetsSerializer(Tweets, await req.getPaginationInfo(Tweets)));
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

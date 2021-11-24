const ApiError = require('../utils/ApiError');
const { User, Tweet, Comment } = require('../database/models');
const TweetSerializer = require('../serializers/UserSerializer');
const TweetsSerializer = require('../serializers/UsersSerializer');

const findTweet = async (body) => {
  const tweet = await Tweet.findOne({
    where: body,
    include: [
      { model: User, as: 'user' },
      { model: Comment, as: 'comment' },
    ],
  });
  if (!tweet) {
    throw new ApiError('Tweet not found', 404);
  }
  return tweet;
};

const createTweet = async (req, res, next) => {
  try {
    const { body } = req;
    if (body.text === null || body.text === undefined || req.user.id === undefined) {
      throw new ApiError('Bad request', 400);
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
  try {
    const TweetList = await Tweet.findAll(
      {
        where: {
          userId: req.user.id,
        },
        ...req.pagination,
        include: [
          { model: User, as: 'user' },
          { model: Comment, as: 'comment' },
        ],
      },
    );
    res.json(new TweetsSerializer(TweetList, await req.getPaginationInfo(Tweet)));
  } catch (err) {
    next(err);
  }
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
    await tweet.save();
    res.json(new TweetSerializer(tweet));
  } catch (err) {
    next(err);
  }
};

const deleteTweet = async (req, res, next) => {
  try {
    const { params } = req;
    const tweet = await findTweet({ id: params.id });
    if (Number(tweet.dataValues.userId) === req.user.id) {
      const deletedTweet = await Tweet.destroy({ where: { id: params.id } });
      res.json(new TweetSerializer(null));
    } else {
      throw new ApiError('Tweet not found', 404);
    }
  } catch (err) {
    next(err);
  }
};

const getFeedUsername = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findOne({ where: { username: params.username, active: true } });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    const tweets = await Tweet.findAll({
      where: {
        userId: user.id,
      },
      ...req.pagination,
      include: [
        { model: User, as: 'user' },
        { model: Comment, as: 'comment' },
      ],
    });
    res.json(new TweetsSerializer(tweets, await req.getPaginationInfo(Tweet)));
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

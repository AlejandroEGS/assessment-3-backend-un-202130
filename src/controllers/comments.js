const ApiError = require('../utils/ApiError');
const { Tweet, Comment, User } = require('../database/models');
const TweetSerializer = require('../serializers/TweetSerializer');
const TweetMethod = require('./tweets');

const findComments = async (body) => {
  const comment = await Comment.findOne({ where: body });
  if (!comment) {
    throw new ApiError('Comment not found', 404);
  }
  return comment;
};

const createComment = async (req, res, next) => {
  try {
    const { body, params } = req;
    await TweetMethod.findTweet({ id: params.id });

    if (body.text === null || body.text === undefined || params.id === undefined) {
      throw new ApiError('Bad request', 400);
    }
    const Payload = {
      text: body.text,
      tweetId: Number(params.id),
      likeCounter: 0,
    };
    const comment = await Comment.create(Payload);
    res.json(new TweetSerializer(comment));
  } catch (err) {
    next(err);
  }
};

const deleteCommentsById = async (req, res, next) => {
  try {
    const { params } = req;

    await findComments({ id: params.id });
    await Comment.destroy({ where: { id: params.id } });
    res.json(new TweetSerializer(null));
  } catch (err) {
    next(err);
  }
};

const likeComment = async (req, res, next) => {
  try {
    const { params } = req;
    const comment = await findComments({ id: params.id });

    const updatedCounter = {
      likeCounter: comment.dataValues.likeCounter + 1,
    };
    Object.assign(comment, updatedCounter);
    await comment.save();
    res.json(new TweetSerializer(comment));
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createComment,
  deleteCommentsById,
  likeComment,
};

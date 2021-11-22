const ApiError = require('../utils/ApiError');
const { Tweet, Comment } = require('../database/models');
const CommentsSerializer = require('../serializers/CommentsSerializer');

const findComments = async (CommentId) => {
  const comment = await Comment.findOne({ where: { id: CommentId, active: true } });
  if (!comment) {
    throw new ApiError('Comment not found', 400);
  }
  return comment;
};

const deleteCommentsById = async (req, res, next) => {
  try {
    const { params } = req;

    const comment = await findComments({ id: params.id });

    if (!comment) {
      throw new ApiError('Tweet not found', 400);
    } else {
      const deletedComment = await Comment.destroy({ where: { id: params.id } });
      console.log(deletedComment);
      res.json(new CommentsSerializer(null));
    }
  } catch (err) {
    next(err);
  }
};

const likeComment = async (req, res, next) => {
  try {
    const { params } = req;

    const comment = await findComments({ id: params.id });

    if (!comment) {
      throw new ApiError('Comment not found', 404);
    }
    const updatedCounter = {
      likeCounter: comment.dataValues.likeCounter + 1,
    };
    Object.assign(comment, updatedCounter);

    const save = await comment.save();
    res.json(new CommentsSerializer(comment));
  } catch (err) {
    next(err);
  }
};
module.exports = {
  deleteCommentsById,
  likeComment,
};

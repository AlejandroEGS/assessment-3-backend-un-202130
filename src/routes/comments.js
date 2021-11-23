const express = require('express');

const router = express.Router();

const CommentsController = require('../controllers/comments');

const { authMiddleware } = require('../middlewares/authMiddleware');

router.delete('/:id', authMiddleware, CommentsController.deleteCommentsById);

router.post('/:id/likes', authMiddleware, CommentsController.likeComment);

module.exports = router;

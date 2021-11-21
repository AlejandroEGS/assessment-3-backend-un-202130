const express = require('express');

const router = express.Router();

const TweetController = require('../controllers/tweets');

const { authMiddleware } = require('../middlewares/authMiddleware');

const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

router.post('/', authMiddleware, TweetController.createTweet);

router.get('/', authMiddleware, paginationMiddleware, TweetController.getAllTweets);

router.get('/:id', TweetController.getTweetById);

module.exports = router;

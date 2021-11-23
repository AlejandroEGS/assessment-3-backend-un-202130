const request = require('supertest');

const app = require('../app');

const { generateAccessToken } = require('../src/services/jwt');

const database = require('../src/database');
const { User, Tweet, Comment } = require('../src/database/models');

const COMMENTS_PATH = '/comments';

const TWEET_PATH = '/tweets';

const FIRST_USER = {
  username: 'user1',
  name: 'User 1',
  email: 'user1@test.com',
  password: '12345',
};

const FIRST_TWEET = {
  text: 'Tweet1',
  likeCounter: 0,
};

const FIRST_COMMENT = {
  text: 'Comment1',
  likeCounter: 0,
};

describe('Comments routes', () => {
  let firstUserAccessToken;

  beforeAll(async () => {
    await database.init();

    const firstUser = await User.create(FIRST_USER);
    firstUserAccessToken = generateAccessToken(firstUser.id, firstUser.role);

    const user = await User.findOne({ FIRST_USER });

    const idTweet = {
      userId: Number(user.dataValues.id),
    };
    const tweet = await Tweet.create(Object.assign(FIRST_TWEET, idTweet));
    /*   const idComment = {
      tweetId: Number(tweet.dataValues.id),
    };
    await Comment.create(Object.assign(FIRST_COMMENT, idComment));
  */
  });

  it('Should create comment', async () => {
    const payload = {
      ...FIRST_COMMENT,
    };
    const response = await request(app).post(`${TWEET_PATH}/1/comments`).send(payload).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.text).toBe(payload.text);
    expect(response.body.data.likeCounter).toBe(0);
    expect(response.body.data.tweetId).toBe(1);
    expect(response.body.data.createdAt).not.toBeNull();
    expect(response.body.data.updatedAt).not.toBeNull();

    expect(response.body.paginationInfo).toBeNull();
  });

  it('Should return tweet not found when commenting on non-existent tweet', async () => {
    const payload = {
      tweetId: 0,
      ...FIRST_COMMENT,
    };
    const response = await request(app).post(`${TWEET_PATH}/2/comments`).send(payload).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Tweet not found');
  });

  it('Should return bad request with invalid payload', async () => {
    const payload = {
      likeCounter: 0,
    };
    const response = await request(app).post(`${TWEET_PATH}/1/comments`).send(payload).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('Bad request');
  });

  it('Should like comment', async () => {
    const payload = {
      id: 1,
      likeCounter: 1,
    };
    const response = await request(app).post(`${COMMENTS_PATH}/1/likes`).send(payload).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.id).toBe(payload.id);
    expect(response.body.data.likeCounter).toBe(payload.likeCounter);
    expect(response.body.data.createdAt).not.toBeNull();
    expect(response.body.data.updatedAt).not.toBeNull();

    expect(response.body.paginationInfo).toBeNull();
  });

  it('Should return comment not found when liking on non-existing comment', async () => {
    const payload = {
      id: 0,
    };
    const response = await request(app).post(`${COMMENTS_PATH}/0/likes`).send(payload).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Comment not found');
  });
  it('Should delete comment', async () => {
    const payload = {
      id: 1,
    };
    const response = await request(app).delete(`${COMMENTS_PATH}/1`).send(payload).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data).toBeNull();
    expect(response.body.paginationInfo).toBeNull();
  });

  it('Should return Comment not found on non-existent comment', async () => {
    const payload = {
      id: 0,
    };
    const response = await request(app).delete(`${COMMENTS_PATH}/1`).send(payload).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Comment not found');

    expect(response.body.data).toBeNull();
  });
});

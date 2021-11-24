const request = require('supertest');

const app = require('../app');

const { ROLES } = require('../src/config/constants');
const { generateAccessToken } = require('../src/services/jwt');

const database = require('../src/database');
const { User, Tweet, Comment } = require('../src/database/models');

const TWEETS_PATH = '/tweets';

const FIRST_USER = {
  username: 'user1',
  name: 'User 1',
  email: 'user1@test.com',
  password: '12345',
};

const FIRST_TWEET = {
  text: 'My first tweet',
};

const FIRST_COMMENT = {
  text: 'My first comment',
};

describe('Tweets routes', () => {
  let firstUserAccessToken;
  let secondUserAccessToken;
  let adminUserAccessToken;

  beforeAll(async () => {
    await database.init();

    const firstUser = await User.create(FIRST_USER);
    firstUserAccessToken = generateAccessToken(firstUser.id, firstUser.role);

    const secondUser = await User.create(Object.assign(FIRST_USER, { active: false }));
    secondUserAccessToken = generateAccessToken(secondUser.id, secondUser.role);

    const adminUser = await User.create(Object.assign(FIRST_USER, { role: ROLES.admin }));
    adminUserAccessToken = generateAccessToken(adminUser.id, adminUser.role);

    const user = await User.findOne({ FIRST_USER });
    const userId = {
      userId: Number(user.dataValues.id),
      likeCounter: 0,
    };
    const tweet = await Tweet.create(Object.assign(FIRST_TWEET, userId));

    const idComment = {
      tweetId: Number(tweet.dataValues.id),
      likeCounter: 0,
    };
    await Comment.create(Object.assign(FIRST_COMMENT, idComment));
  });

  it('Should get all tweets', async () => {
    const payload = {
      ...FIRST_TWEET,
    };
    const response = await request(app).get(TWEETS_PATH).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data[0].text).toBe(payload.text);
    expect(response.body.data[0].likeCounter).toBe(payload.likeCounter);
    expect(response.body.data[0].userId).toBe(payload.userId);
    expect(response.body.data[0].createdAt).not.toBeNull();
    expect(response.body.data[0].updatedAt).not.toBeNull();

    expect(response.body.paginationInfo.totalItems).toBe(1);
    expect(response.body.paginationInfo.totalPages).toBe(1);
    expect(response.body.paginationInfo.currentPage).toBe(1);
  });

  it('Should return unauthorized on get all tweets', async () => {
    const payload = {
      ...FIRST_TWEET,
    };
    const response = await request(app).get(TWEETS_PATH).send(payload);
    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Invalid token');
  });

  it('Should create tweet', async () => {
    const payload = {
      text: 'string',
      ...FIRST_TWEET,
    };
    const response = await request(app).post(TWEETS_PATH).set('Authorization', `bearer ${firstUserAccessToken}`).send(payload);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.text).toBe(payload.text);
    expect(response.body.data.likeCounter).toBe(payload.likeCounter);
    expect(response.body.data.userId).toBe(payload.userId);
    expect(response.body.data.createdAt).not.toBeNull();
    expect(response.body.data.updatedAt).not.toBeNull();

    expect(response.body.paginationInfo).toBeNull();
  });

  it('Should return bad request on create tweet with invalid payload', async () => {
    const payload = {
      text: null,
    };
    const response = await request(app).post(TWEETS_PATH).set('Authorization', `bearer ${firstUserAccessToken}`).send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('Bad request');
  });

  it('Should return unauthorized on create tweet', async () => {
    const payload = {
      text: 'string',
      ...FIRST_TWEET,
    };
    const response = await request(app).post(TWEETS_PATH).send(payload);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Invalid token');
  });

  it('Should get tweet by id', async () => {
    const TWEET_ID = 1;
    const response = await request(app).get(`${TWEETS_PATH}/${TWEET_ID}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.createdAt).not.toBeNull();
    expect(response.body.data.updatedAt).not.toBeNull();

    expect(response.body.paginationInfo).toBeNull();
  });

  it('Should like tweet', async () => {
    const TWEET_ID = 1;
    const response = await request(app).post(`${TWEETS_PATH}/${TWEET_ID}/likes`).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.createdAt).not.toBeNull();
    expect(response.body.data.updatedAt).not.toBeNull();

    expect(response.body.paginationInfo).toBeNull();
  });

  it('Should return unauthorized on liking tweet', async () => {
    const TWEET_ID = 1;
    const response = await request(app).post(`${TWEETS_PATH}/${TWEET_ID}/likes`);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Invalid token');
  });

  it('Should return tweet not found on liking non-existing tweet', async () => {
    const TWEET_ID = 0;
    const response = await request(app).post(`${TWEETS_PATH}/${TWEET_ID}/likes`).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Tweet not found');
  });

  it('Should create tweet comment', async () => {
    const TWEET_ID = 1;
    const payload = {
      text: 'string',
      ...FIRST_TWEET,
    };
    const response = await request(app).post(`${TWEETS_PATH}/${TWEET_ID}/comments`).set('Authorization', `bearer ${firstUserAccessToken}`).send(payload);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.text).toBe(payload.text);
    expect(response.body.data.likeCounter).toBe(payload.likeCounter);
    expect(response.body.data.user).not.toBeNull();
    expect(response.body.data.createdAt).not.toBeNull();
    expect(response.body.data.updatedAt).not.toBeNull();

    expect(response.body.paginationInfo).toBeNull();
  });

  it('Should return bad request with invalid payload', async () => {
    const TWEET_ID = 1;
    const payload = {
      text: null,
    };
    const response = await request(app).post(`${TWEETS_PATH}/${TWEET_ID}/comments`).set('Authorization', `bearer ${firstUserAccessToken}`).send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('Bad request');
  });

  it('Should return unauthorized on creating tweet comment', async () => {
    const TWEET_ID = 1;
    const payload = {
      text: 'string',
      ...FIRST_TWEET,
    };
    const response = await request(app).post(`${TWEETS_PATH}/${TWEET_ID}/comments`).send(payload);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Invalid token');
  });

  it('Should return tweet not found on creating tweet comment', async () => {
    const TWEET_ID = 0;
    const payload = {
      text: 'string',
      ...FIRST_TWEET,
    };
    const response = await request(app).post(`${TWEETS_PATH}/${TWEET_ID}/comments`).set('Authorization', `bearer ${firstUserAccessToken}`).send(payload);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Tweet not found');
  });

  it('Should get all tweets by user', async () => {
    const USER_ID = 'user1';
    const response = await request(app).get(`${TWEETS_PATH}/feed/${USER_ID}`).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.createdAt).not.toBeNull();
    expect(response.body.data.updatedAt).not.toBeNull();

    expect(response.body.paginationInfo).not.toBeNull();
  });

  it('Should return user not found on non-existing user', async () => {
    const USER_ID = 'nulluser';
    const response = await request(app).get(`${TWEETS_PATH}/feed/${USER_ID}`).set('Authorization', `bearer ${firstUserAccessToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('User not found');
  });

  it('Should return tweet not found', async () => {
    const TWEET_ID = 0;
    const response = await request(app).get(`${TWEETS_PATH}/${TWEET_ID}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Tweet not found');
  });

  it('Should return unauthorized on delete tweet', async () => {
    const TWEET_ID = 1;
    const response = await request(app).delete(`${TWEETS_PATH}/${TWEET_ID}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Invalid token');
  });

  it('Should return tweet not found on delete tweet from other user', async () => {
    const TWEET_ID = 1;
    const response = await request(app).delete(`${TWEETS_PATH}/${TWEET_ID}`).set('Authorization', `bearer ${secondUserAccessToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Tweet not found');
  });

  it('Should delete tweet by id', async () => {
    const TWEET_ID = 1;
    const response = await request(app).delete(`${TWEETS_PATH}/${TWEET_ID}`).set('Authorization', `bearer ${firstUserAccessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data).toBeNull();

    expect(response.body.paginationInfo).toBeNull();
  });
});

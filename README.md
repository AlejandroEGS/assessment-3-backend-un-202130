# Trinos API

## How to run?
```bash
docker-compose up
```

## Run tests
```bash
docker-compose exec api npm run test
```
### Output
```
> trinos-api@1.0.0 test /usr/src/app
> jest

 PASS  tests/index.test.js
  Index routes
    ✓ Should return not found (96 ms)

 PASS  tests/tweets.test.js
  Tweets routes
    ✓ Should get all tweets (77 ms)
    ✓ Should return unauthorized on get all tweets (27 ms)
    ✓ Should create tweet (8 ms)
    ✓ Should return bad request on create tweet with invalid payload (5 ms)
    ✓ Should return unauthorized on create tweet (4 ms)
    ✓ Should get tweet by id (12 ms)
    ✓ Should like tweet (18 ms)
    ✓ Should return unauthorized on liking tweet (7 ms)
    ✓ Should return tweet not found on liking non-existing tweet (10 ms)
    ✓ Should create tweet comment (15 ms)
    ✓ Should return bad request with invalid payload (11 ms)
    ✓ Should return unauthorized on creating tweet comment (5 ms)
    ✓ Should return tweet not found on creating tweet comment (10 ms)
    ✓ Should get all tweets by user (15 ms)
    ✓ Should return user not found on non-existing user (7 ms)
    ✓ Should return tweet not found (8 ms)
    ✓ Should return unauthorized on delete tweet (5 ms)
    ✓ Should return tweet not found on delete tweet from other user (11 ms)
    ✓ Should delete tweet by id (11 ms)

 PASS  tests/comments.test.js
  Comments routes
    ✓ Should create comment (94 ms)
    ✓ Should return tweet not found when commenting on non-existent tweet (12 ms)
    ✓ Should return bad request with invalid payload (10 ms)
    ✓ Should like comment (12 ms)
    ✓ Should return comment not found when liking on non-existing comment (7 ms)
    ✓ Should delete comment (10 ms)
    ✓ Should return Comment not found on non-existent comment (8 ms)

 PASS  tests/users.test.js (7.661 s)
  Users routes
    ✓ Should create user (170 ms)
    ✓ Should return bad request on create user with invalid payload (10 ms)
    ✓ Should return bad request with missmatch passwords (4 ms)
    ✓ Should get user by id (23 ms)
    ✓ Should return access token required when token is null (5 ms)
    ✓ Should return bad request on get a deactivated user (9 ms)
    ✓ Should update user (1287 ms)
    ✓ Should return bad request on update user with wrong payload (7 ms)
    ✓ Should return User not found when user does not exist (6 ms)
    ✓ Should return access token required on update user with null token (4 ms)
    ✓ Should return unauthorized on update deactivated user (4 ms)
    ✓ Should return bad request on update user with invalid payload (6 ms)
    ✓ Should deactivate user (15 ms)
    ✓ Should return unauthorized on deactivate user when does not exist (4 ms)
    ✓ Should return access token required when token is null (3 ms)
    ✓ Should return bad request when token is wrong (5 ms)
    ✓ Should return user not found on deactivate user when user does not exist  (6 ms)
    ✓ Should login with username and password (93 ms)
    ✓ Should return bad request on login with wrong payload (4 ms)
    ✓ Should return error on login with wrong password (90 ms)
    ✓ Should admin role get all users (12 ms)
    ✓ Should return unauthorized on get all users with regular role (4 ms)
    ✓ Should return access token required on get all users with null token (4 ms)
    ✓ Should send password reset with username (1261 ms)
    ✓ Should return error on send password reset with wrong username (7 ms)
    ✓ Should return bad request on send password reset with invalid payload (4 ms)
    ✓ Should reset password (182 ms)
    ✓ Should return bad request on reset password with invalid payload (4 ms)
    ✓ Should return access token required on update password when token is null (4 ms)
    ✓ Should return bad request on update password with missmatch passwords (4 ms)
    ✓ Should logout sucessfully (3 ms)
    ✓ Should throw error by invalid token (4 ms)
    ✓ Should return unauthorized on update password when token does not exist (3 ms)

--------------------------|---------|----------|---------|---------|-----------------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------|---------|----------|---------|---------|-----------------------------
All files                 |   98.52 |    96.36 |     100 |   98.52 |                            
 app                      |     100 |      100 |     100 |     100 |                            
  app.js                  |     100 |      100 |     100 |     100 |                            
 app/src/config           |     100 |      100 |     100 |     100 |                            
  constants.js            |     100 |      100 |     100 |     100 |                            
  index.js                |     100 |      100 |     100 |     100 |                            
  mailer.js               |     100 |      100 |     100 |     100 |                            
 app/src/controllers      |   97.33 |    95.06 |     100 |   97.33 |                            
  comments.js             |     100 |      100 |     100 |     100 |                            
  tweets.js               |     100 |      100 |     100 |     100 |                            
  users.js                |   95.09 |    92.16 |     100 |   95.09 | 145-146,150,152-157,208-209
 app/src/middlewares      |     100 |      100 |     100 |     100 |                            
  authMiddleware.js       |     100 |      100 |     100 |     100 |                            
  paginationMiddleware.js |     100 |      100 |     100 |     100 |                            
 app/src/routes           |     100 |      100 |     100 |     100 |                            
  comments.js             |     100 |      100 |     100 |     100 |                            
  tweets.js               |     100 |      100 |     100 |     100 |                            
  users.js                |     100 |      100 |     100 |     100 |                            
 app/src/serializers      |     100 |      100 |     100 |     100 |                            
  AuthSerializer.js       |     100 |      100 |     100 |     100 |                            
  BaseSerializer.js       |     100 |      100 |     100 |     100 |                            
  TweetSerializer.js      |     100 |      100 |     100 |     100 |                            
  UserSerializer.js       |     100 |      100 |     100 |     100 |                            
  UsersSerializer.js      |     100 |      100 |     100 |     100 |                            
 app/src/services         |     100 |      100 |     100 |     100 |                            
  jwt.js                  |     100 |      100 |     100 |     100 |                            
 app/src/utils            |     100 |      100 |     100 |     100 |                            
  ApiError.js             |     100 |      100 |     100 |     100 |                            
--------------------------|---------|----------|---------|---------|-----------------------------
Test Suites: 4 passed, 4 total
Tests:       60 passed, 60 total
Snapshots:   0 total
Time:        9.556 s
Ran all test suites.

```

## Run linter
```bash
docker-compose exec api npm run linter
```
### Output
```
PS C:\Users\TheLokestraps\Documents\GitHub\assessment-3-backend-un-202130> docker-compose exec api npm run linter

> trinos-api@1.0.0 linter /usr/src/app
> eslint bin/www src/**/*.js app.js


/usr/src/app/bin/www
  66:7  warning  Unexpected console statement  no-console
  70:7  warning  Unexpected console statement  no-console
  87:3  warning  Unexpected console statement  no-console

✖ 3 problems (0 errors, 3 warnings)


```

## Integrantes:
### Nombre: Alejandro Gonzalez, Codigo: 200123798
### Nombre: Kang Lei, Codigo: 200108179
### Nombre: Ivan Perez, Codigo: 200127518

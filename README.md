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

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
--------------------------|---------|----------|---------|---------|-------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------|---------|----------|---------|---------|-------------------
All files                 |     100 |      100 |     100 |     100 |
 app                      |     100 |      100 |     100 |     100 |
  app.js                  |     100 |      100 |     100 |     100 |
 app/src/config           |     100 |      100 |     100 |     100 |
  constants.js            |     100 |      100 |     100 |     100 |
  index.js                |     100 |      100 |     100 |     100 |
 app/src/controllers      |     100 |      100 |     100 |     100 |
  users.js                |     100 |      100 |     100 |     100 |
 app/src/middlewares      |     100 |      100 |     100 |     100 |
  authMiddleware.js       |     100 |      100 |     100 |     100 |
  paginationMiddleware.js |     100 |      100 |     100 |     100 |
 app/src/routes           |     100 |      100 |     100 |     100 |
  users.js                |     100 |      100 |     100 |     100 |
 app/src/serializers      |     100 |      100 |     100 |     100 |
  AuthSerializer.js       |     100 |      100 |     100 |     100 |
  BaseSerializer.js       |     100 |      100 |     100 |     100 |
  UserSerializer.js       |     100 |      100 |     100 |     100 |
  UsersSerializer.js      |     100 |      100 |     100 |     100 |
 app/src/services         |     100 |      100 |     100 |     100 |
  jwt.js                  |     100 |      100 |     100 |     100 |
 app/src/utils            |     100 |      100 |     100 |     100 |
  ApiError.js             |     100 |      100 |     100 |     100 |
--------------------------|---------|----------|---------|---------|-------------------
Test Suites: 2 passed, 2 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        3.071 s
Ran all test suites.
```

## Integrantes:
### Nombre: Alejandro Gonzalez, Codigo: 200123798
### Nombre: Kang Lei, Codigo: 200108179
### Nombre: Ivan Perez, Codigo: 200127518
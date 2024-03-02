# Login and signup REST-API

- Nodejs
- Typescript
- Fastify
- Prisma
- PostgreSQL
- JWTdocker ps

## Functional Requirements

- [ x ] User can create an account
    - [ x ] password must be encrypted
- [ x ] Must be able to get all users
- [ x ] User can login on your session
- [ x ] Must be able to get user profile in session
- [ ] User can edit your profile datas
- [ ] User can delete your account

## Business Rules

- [ x ] cpf must be encrypted and saved in database
- [ x ] Can't have accounts with the same email

## Non-functional requirement

- [ x ] User password must be encrypted on the signup time
- [ x ] User data must be registered in a PostgreSQL data bank
- [ x ] Use JTW like authetication strategy
- [ ] Must have a Refresh Token
- [ ] Clean code and Best practices, SOLID principles and Design Patters
- [ ] application must be tested

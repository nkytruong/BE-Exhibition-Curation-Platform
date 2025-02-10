# EXHIBIT

EXHIBIT is an online platform that allows users to view artwork from different musuems. Users are able to view each artwork in detail and are able to create their own exhibitions consisting of their favourite art pieces.

This is the back-end API component of the project.

## Tech Stack
- TypeScript
- Node
- Express
- PostgreSQL

## Local Setup
1) Clone this [repository](https://github.com/nkytruong/BE-Exhibition-Curation-Platform) by running the following command: 

`git clone https://github.com/nkytruong/BE-Exhibition-Curation-Platform`

2) Navigate to the cloned repository and run the following command to install all dependencies needed:

`npm install`

3) To connect to the databases locally, you must add the following 2 files, consisting of `PGDATABASE` (the name of your database) and `JWT_SECRET` (a secret key used to create JWT tokens):

``` 
// .env.test

PGDATABASE=[YOURTESTDATABASE]
JWT_SECRET=[YOURSECRETKEY]

```
```
// .env.development

PGDATABASE=[YOURACTUALDATABASE]
JWT_SECRET=[YOURSECRETKEY]
```

4) Setup and seed your database by running the following commands:

```
npm run setup-dbs
npm run seed
```

5) Run the tests files found in __tests__

```
npm test auth-tests
npm test auth-utils-tests
npm test users-tests
npm tests userCollections-tests
npm test collectionItems-tests

```

## Minimum Version Requirements
- TypeScript v5.7.3
- Node.js v21.7.2
- Express.js v4.21.2
- PostgreSQL v8.13.1
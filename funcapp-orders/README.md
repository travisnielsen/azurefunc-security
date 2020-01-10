# Orders API

This is a sample API based on the [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository with [additional integration](https://trilon.io/blog/deploy-nestjs-azure-functions) that allows it to run as an Azure Function. It showcases the use of middleware to for client certificate authorization, which happens after Azure App Services successfully establishes a Mutual TLS channel.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

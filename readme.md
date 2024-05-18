## Postcode checker

[![Actions Status](https://github.com/umaar/postcode-checker/workflows/Node%20CI/badge.svg)](https://github.com/umaar/postcode-checker/actions)

### About

This is a Node.js powered webpage which informs you whether or not a postcode is allowed, according to small set of business logic. In this readme, you can find instructions on how to run this locally, how this is deployed, and some developer facing features for you to be aware of.

### Instructions

#### To run locally

To run this webpage locally, complete the following steps:

1. Install Node.js **v21.1.0** or later (use [nvm](https://github.com/nvm-sh/nvm) if you want to manage multiple versions).
    - Older versions may work, but are untested.
    - Windows has not been fully tested and may not run tests correctly
2. Clone/download this project from GitHub.
3. In your terminal, `cd` into this repository and run `npm install`.
4. Run the command `npm start` and navigate to the URL presented in the terminal, for example: `localhost:3000`.

#### Database Initialization

Before running the application for the first time, ensure to initialize the SQLite database by running the following command:

```sh
npm run init-db
```

This will create the necessary database and tables for storing postcode search data.

#### Tests

Note the following commands:

```sh
# Run all tests
npm test

# Run JavaScript linting
npm run lint

# Run unit tests
npx ava --node-arguments=\"--loader=quibble\" --verbose test/unit/**/*.js

# Run integration tests
npx ava --verbose test/integration/**/*.js

# Run end to end tests
npx ava --verbose test/e2e/**/*.js
```

#### To change configuration

To change configuration, just as the allow list for a postcode, check the `default.json` configuration file in the `config` folder.

#### Deployment

Deployment, and testing on CI, happens through the `.github/workflows/nodejs.yml` file, so check it out to learn more. The webpage gets deployed to Heroku.

### Developer facing features

-   Uses Modern JS features like, ES Modules (ESM)
-   Complete testing suite (unit, integration and end-to-end)
    -   Includes test parallelization thanks to `ava`
    -   Includes code linting
    -   Full test isolation during unit testing
-   Able to spin up multiple versions of this web app with randomised ports
-   Minimal dependencies, no web frameworks, or complicated build pipeline, no JavaScript on the client-side
-   Continuous integration + deployment with GitHub Actions

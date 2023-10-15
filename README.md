<div id="container">
  <img src="./media/postBuddy.png" width="128" alt="PostBuddy" ></img>
</div>

# PostBuddy

![Deployment status](https://github.com/Jesperilmari/PostBuddy/actions/workflows/deploy.yml/badge.svg)

- [PostBuddy](#postbuddy)
  - [Deployments](#deployments)
  - [What the project does](#what-the-project-does)
  - [Why the project is useful (include target audience)](#why-the-project-is-useful-include-target-audience)
  - [Usage](#usage)
    - [Backend](#backend)
      - [Installation](#installation)
      - [Running](#running)
    - [Frontend](#frontend)
      - [Installation](#installation-1)
      - [Running](#running-1)
  - [Demos/Screenshots](#demosscreenshots)
  - [Technologies used](#technologies-used)
    - [Backend](#backend-1)
    - [Frontend](#frontend-1)
  - [Testing](#testing)
    - [Test coverage](#test-coverage)
  - [Misc diagrams or other architectural stuff](#misc-diagrams-or-other-architectural-stuff)
  - [Contributors](#contributors)
  - [Related resources](#related-resources)
    - [Useful documentation](#useful-documentation)

## Deployments

The backend is deployed at Azure  
[Graphql sandbox](https://postbuddy-api.azurewebsites.net/graphql)

The website is deployed on Vercel  
[Website](https://postbuddy.vercel.app)

## What the project does

## Why the project is useful (include target audience)

## Usage

This repository is divided into two subprojects located in the `packages` folder. Currently this folder contains code for the backend and for the frontend.

If you simply wish to use the site or the graphql sandbox,
navigate see [deployments](#deployments)

### Backend

#### Installation

Change your working directory to `packages/backend` and run the command to install all of the dependencies.

```
npm install
```

_You might need to install some other required dependendies like nodemon etc manually which are currently not listed in devDependencies_

#### Running

Before running create a valid `.env` file accoring to the `.env.sample`.
You will not be able to start the development server if any of the variables are missing.

All of the available script are located in the `package.json`. Here are some useful scripts

Development mode

```
npm run dev
```

Build

```
npm run build
```

Clear development database

```
npm run clearDb
```

Tests

```
npm run test
```

or with coverage

```
npm run test:cov
```

### Frontend

#### Installation

Change your working directory to `packages/frontend` and run the command to install all of the dependencies.

```
npm install
```

#### Running

To run in development mode use the command.

```
npm run dev
```

This will also print the address where the website is hosted at,
most likely being http://localhost:5174.

## Demos/Screenshots

## Technologies used

### Backend

- [Express](https://www.npmjs.com/package/express)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [Oauth](https://www.npmjs.com/package/oauth)
- [cron](https://www.npmjs.com/package/cron)
- [ffmpeg](https://www.npmjs.com/package/ffmpeg)
- [Apollo server](https://www.npmjs.com/package/@apollo/server)
- [jwt](https://www.npmjs.com/package/jsonwebtoken)
- [and more](/packages/backend/package.json)

### Frontend

- [React](https://www.npmjs.com/package/react)
- [Redux](https://redux.js.org/)
- [axios](https://www.npmjs.com/package/axios)
- [Material UI](https://mui.com/)
- [dayjs](https://www.npmjs.com/package/dayjs)
- [and more](/packages/frontend/package.json)

## Testing

Testing for the backend is comprehensive,
containing integration tests for vital endpoints and
unit tests for important components to ensure intended funcionality.

Frontend currently has no tests. This could be a point to improve in
the future.

Parts where coverage is missing have either been manually tested or
are just not correctly displayed in the report.

### Test coverage

![Coverage](./media/backend_test_cov.png)

Jest was a obvious choice for a test framework.
But we also exploit [ts-mockito's](https://github.com/NagRock/ts-mockito) ability to create mocks of
classes and interfaces with no effort.

Jest's builtin mock function has also proven itself very useful
when mocking entire libraries without needing dependency injection.
Example: [postCreatorHandlers.test.ts](/packages/backend/test/postCreatorHandlers.test.ts)

## Misc diagrams or other architectural stuff

## Contributors

[Jesper Ojala](https://github.com/Jesperilmari)  
[Mikko Tanhola](https://github.com/M1kkoT)  
[Olli Varila](https://github.com/ollivarila)

## Related resources

### Useful documentation

- [Twitter api](https://developer.twitter.com/en/docs/twitter-api)
- [Mongoose](https://mongoosejs.com/docs/)
- [Material UI](https://mui.com/material-ui/getting-started/)

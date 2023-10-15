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
  - [Testing](#testing)
    - [Test coverage](#test-coverage)
  - [Misc diagrams or other architectural stuff](#misc-diagrams-or-other-architectural-stuff)
  - [Contributors](#contributors)
  - [Related resources](#related-resources)

## Deployments

The backend is deployed at Azure  
[Graphql sandbox](https://postbuddy-api.azurewebsites.net/graphql)

The website is deployed on Vercel  
[Website](https://postbuddy.vercel.app)

## What the project does
PostBuddy is a web app designed to simplify the process of sharing content across various social media platforms by providing an intuitive and efficient dashboard solution. 

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
Before creating any posts you are required to connect your account to any of the supported social medias.

Logging in:

https://github.com/Jesperilmari/PostBuddy/assets/96197093/e9998b05-dffd-4449-bc1f-12ff521e62b2

Registering an account:

https://github.com/Jesperilmari/PostBuddy/assets/96197093/b4078512-1d48-4de9-93e9-b91e86c55b1f

Connecting twitter:

https://github.com/Jesperilmari/PostBuddy/assets/96197093/14595df8-3160-47fe-9edc-bda6dfe3dd77

Creating a twitter post:

https://github.com/Jesperilmari/PostBuddy/assets/96197093/1e47a52b-04d9-4cdf-b4ed-f61fc92970d8

Creating a scheduled twitter post:

https://github.com/Jesperilmari/PostBuddy/assets/96197093/d3ff2c18-cfdc-4d08-b0a2-c242d919db3e

Changing user information:

https://github.com/Jesperilmari/PostBuddy/assets/96197093/08eda110-576c-460a-9eff-5a94166d2afd

Changing password:

https://github.com/Jesperilmari/PostBuddy/assets/96197093/e99a6bed-659a-44b5-ad2f-e285898e180e

Revoking PostBuddys twitter access:

https://github.com/Jesperilmari/PostBuddy/assets/96197093/61d09ccd-8d26-4437-a0fb-fc9ea725ea6f

## Technologies used

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

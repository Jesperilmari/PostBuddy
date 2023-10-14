<style>
    #container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        margin-bottom: 4rem
    }
</style>

<div id="container">
  <img src="./media/postBuddy.png" width="128" alt="PostBuddy" ></img>
</div>

### Deployments

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
But we also exploit `ts-mock`'s ability to create mocks of
libraries with no effort.

Jest's builtin mock function has also proven itself very useful
when mocking entire libraries without needing dependency injection
example: [postCreatorHandlers.test.ts](/packages/backend/test/postCreatorHandlers.test.ts)

## Misc diagrams or other architectural stuff

## Contributors

[Jesper Ojala](https://github.com/Jesperilmari)  
[Mikko Tanhola](https://github.com/M1kkoT)  
[Olli Varila](https://github.com/ollivarila)

## Related resources

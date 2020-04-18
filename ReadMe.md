# curtain-call

<!-- Badges -->
[![curtain-call](https://img.shields.io/npm/v/curtain-call.svg)](https://www.npmjs.com/package/curtain-call)
![pipeline](https://gitlab.com/sankaku-deltalab/curtain-call/badges/master/pipeline.svg)
![coverage](https://gitlab.com/sankaku-deltalab/curtain-call/badges/master/coverage.svg)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Setup

- Replace package.json repository.url to your repository path
- Fix tsconfig.json paths
- `npm install`
- `npm run bootstrap`

## Usage

- create new package: `npm run create <package-name>`
- add dependency: `npx lerna add <package-name> --scope=<scope>`
  - @see: [@lerna/add](https://github.com/lerna/lerna/tree/master/commands/add#readme)
- lint: `npm run lint`
- test: `npm run test`
- build js files: `npm run bootstrap`
- publish packages: `npm run publish-all`

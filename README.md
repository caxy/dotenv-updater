![npm (scoped)](https://img.shields.io/npm/v/@caxy/dotenv-updater?style=flat-square)
![npm](https://img.shields.io/npm/dm/@caxy/dotenv-updater?style=flat-square)

# Dotenv Updater

Dotenv Updater is a module that keeps your local, gitignored, `.env` files up to date with the latest 
variables defined in a dist/example file, like `.env.dist`.

It compares your `.env` file with the `.env.dist` (or other file specified in config), and if there any
variables missing from your `.env` file it will interactively prompt you for their values on the command
line, and update your `.env` file for you.

## Install

```bash
# with npm
npm install --save-dev dotenv-updater

# or with Yarn
yarn add --dev dotenv-updater
```

## Usage

The primary use-case is to run this script alongside your other npm/Yarn scripts defined in your `package.json`.

For example, you can add calls to `dotenv-updater` at the beginning of your commonly run scripts,
so that you can ensure you'll always have an up-to-date env file. 

```json
# in your package.json

"scripts": {
  # ...
  "update-env": "dotenv-updater",
  "start": "dotenv-updater && node dist/index.js",
  "build": "dotenv-updater && npm run clean && ...",
  # ...
},
...
```

You could also add it as a separate script that you could run manually at any time.

```json
# in your package.json

"scripts": {
  "update-env": "dotenv-updater",
  # ...
}
```

Then to run it:

```bash
# with npm
npm run update-env

# or with Yarn
yarn run update-env
```

You could also run it manually from the command line if you installed it globally:

```bash
dotenv-updater
``` 

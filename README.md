# Dotenv Updater

Dotenv Updater is a module that keeps your local, gitignored, `.env` files up to date with the latest 
variables defined in a dist/example file, like `.env.dist`.

It compares your `.env` file with the `.env.dist` (or other file specified in config), and if there any
variables missing from your `.env` file it will interactively prompt you for their values on the command
line, and update your `.env` file for you.

## Install

```bash
# with npm
npm install dotenv-updater

# or with Yarn
yarn add dotenv-updater
```

## Usage

You can run it manually from the command line.

```bash
yarn run dotenv-updater
``` 

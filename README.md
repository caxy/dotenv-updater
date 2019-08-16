![npm (scoped)](https://img.shields.io/npm/v/@caxy/dotenv-updater?style=flat-square)
![npm](https://img.shields.io/npm/dm/@caxy/dotenv-updater?style=flat-square)

# Dotenv Updater

Dotenv Updater is a module that keeps your local, gitignored, `.env` files up to date with the latest 
variables defined in a dist/example file, like `.env.example`.

It compares your `.env` file with the `.env.example` (or other file specified in config), and if there any
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
  "start": "dotenv-updater && node dist/index.js",
  "build": "dotenv-updater && ..."
},
...
```

You can also run it manually from the command line at the root of the project (or anywhere if installed globally):

```bash
dotenv-updater
``` 

## Configuration

You can add configuration in your `package.json` file to modify some of the default settings,
which you will definitely want to do if your dist file is not named `.env.example`.

Below shows the configuration options available and their default values.

```json
# in your package.json

{
  # ...

  "dotenvUpdater": {
    "envFile": ".env",
    "distFile": ".env.example",
    "checkExtraVars": true
  }
}
```

### Options

| Option name    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Default value    |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| envFile        | The name of the local env file. This is the file that will be updated with new variables found in the distFile. This file is often ignored and excluded from source control since it may contain sensitive information.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `".env"`         |
| distFile       | The name of the "dist" env file, which serves as the empty template for the environment variables that are available to be defined. This file is often tracked in the repository and has default/placeholder values.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `".env.example"` |
| checkExtraVars | Boolean flag to enable/disable the "check extra vars" feature. When set to `true`, the script will check to see if there are any variables defined in the `envFile` that are not defined in the `distFile`. If any are found, a message will be printed to the console indicating that there are extra variables not found in the dist file and will include which variables. <br><br>The idea here is that if there are any extra variables in the `envFile`, they might be outdated / no longer used and can be removed, or it might be an indication that the `distFile` is missing some variables that are used and they should be updated with those. <br><br>This will not remove any variables from the `envFile`, it will only log a message to the console. | `true`           |

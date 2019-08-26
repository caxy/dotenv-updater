'use strict'

const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')

const DEFAULT_SOURCE_FILENAME = '.env'
const DEFAULT_DIST_FILENAME = '.env.example'

const defaultConfig = {
  envFile: DEFAULT_SOURCE_FILENAME,
  distFile: DEFAULT_DIST_FILENAME,
  checkExtraVars: true,
};

// Try to load package.json file of project this is being run from to look for configuration settings.
const pkgJson = findPackageJson();
let fileJson;

if (!pkgJson) {
  throw new Error("Could not find a package.json file. Run 'npm init' to create one.");
}

try {
  fileJson = JSON.parse(fs.readFileSync(pkgJson, "utf8"));
} catch (e) {
  const error = new Error(e);

  error.messageTemplate = "failed-to-read-json";
  error.messageData = {
    path: pkgJson,
    message: e.message
  };
  throw error;
}

// Get command line arguments that may override config.
const configArgs = {};
const [envFileArg] = process.argv.slice(2);
if (envFileArg) {
  configArgs.envFile = envFileArg;
}

const config = Object.assign({}, defaultConfig, fileJson.dotenvUpdater || {}, configArgs);

const sourceFile = path.resolve(process.cwd(), config.envFile)
const distFile = path.resolve(process.cwd(), config.distFile)

/**
 * Find the closest package.json file, starting at process.cwd (by default),
 * and working up to root.
 *
 * @param   {string} [startDir=process.cwd()] Starting directory
 * @returns {string|null}                     Absolute path to closest package.json file
 */
function findPackageJson (startDir) {
  let dir = path.resolve(startDir || process.cwd())

  do {
    const pkgFile = path.join(dir, 'package.json')

    if (!fs.existsSync(pkgFile) || !fs.statSync(pkgFile).isFile()) {
      dir = path.join(dir, '..')
      continue
    }

    return pkgFile
  } while (dir !== path.resolve(dir, '..'))

  return null
}

async function promptForKeyValues (missingKeys, defaultValues = {}) {
  const questions = missingKeys.map(key => ({
    type: 'input',
    name: key,
    message: key,
    default: defaultValues[key]
  }))

  return inquirer.prompt(questions)
}

function parseFile (filePath) {
  const result = dotenv.config({ path: filePath })

  if (result.error) {
    throw result.error
  }

  return result.parsed
}

function loadEnvVariables () {
  let env, dist;
  try {
    env = parseFile(sourceFile);
  } catch (e) {
    // If no env file found, we'll create one.
    env = {};
  }

  try {
    dist = parseFile(distFile);
  } catch (e) {
    throw new Error(`Failed to load or parse dist file ${distFile}.`);
  }

  return { env, dist }
}

async function execute () {
  // Verify the dist file exists.
  try {
    await fs.access(distFile);
  } catch (e) {
    console.error(
      `ERROR: Dist file does not exist or could not be read. Error message: ${e.message}
      If your dist file is named something different, you can configure the dist file name in your package.json. See the README for more details.`
    );

    process.exit(1);
  }

  try {
    const { env, dist } = loadEnvVariables();

    const envKeys = Object.keys(env)
    const distKeys = Object.keys(dist)

    const missingKeys = distKeys.filter(x => !envKeys.includes(x))
    const extraKeys = envKeys.filter(x => !distKeys.includes(x))

    if (missingKeys.length > 0) {
      console.log('.env file is missing the following variables:', missingKeys)
      console.log('Let\'s add these variables now! Enter values or hit enter to accept the defaults.')

      const answers = await promptForKeyValues(missingKeys, dist)

      let envString = ''
      for (const [key, value] of Object.entries(answers)) {
        envString += `${key}=${value}\n`
      }

      console.log(`${config.envFile} will be appended with the new variables below:`)
      console.log(envString)

      await fs.appendFile(sourceFile, envString)

      console.log(`${config.envFile} updated successfully!`);

    } else {
      console.log(`${config.envFile} file is up to date!`)
    }

    if (config.checkExtraVars && extraKeys.length > 0) {
      console.log(
        `[NOTE] Your ${config.envFile} file has extra variables that are not in ${config.distFile}.`,
        '\n       If they are no longer used, might want to remove them.',
        `\n       If they are used, consider adding them to the ${config.distFile} file.`,
        '\n       Extra keys:',
        extraKeys,
        '\n(you can disable this warning in config by setting `checkExtraVars` to `false`)'
      );
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

execute()

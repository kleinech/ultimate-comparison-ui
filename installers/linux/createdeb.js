const createDebPackage = require('electron-installer-debian');
const path = require('path');

const version = require('../../package.json').version;

const rootPath = path.join('./');

const options = {
  src: path.join(rootPath, 'packages', `ultimate-comparison-ui-${version}-linux-x64`),
  dest: "packages/",
  categories: [
    "Utility"
  ],
  lintianOverrides: [
    "changelog-file-missing-in-native-package"
  ],
  bin: `ultimate-comparison-ui-${version}`,
  arch: 'amd64'
};

console.log('Creating package (this may take a while)');

createDebPackage(options)
  .then(() => console.log(`Successfully created package at ${options.dest}`))
  .catch(err => {
    console.error(err, err.stack);
    process.exit(1)
  });

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

const version = require('../../package.json').version;

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1)
  });

function getInstallerConfig() {
  console.log('creating windows installer');
  const rootPath = path.join('./');
  const outPath = path.join(rootPath, 'packages');
  console.log(`Path: ultimate-comparison-ui-${version}-win32-ia32/`);
  return Promise.resolve({
    appDirectory: path.join(outPath, `ultimate-comparison-ui-${version}-win32-ia32/`),
    authors: 'Christoph Kleine',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: `ultimate-comparison-ui-${version}.exe`,
    setupExe: 'UltimateComparisonUIInstaller.exe',
    setupIcon: path.join(rootPath, 'src', 'favicon.ico')
  });
}

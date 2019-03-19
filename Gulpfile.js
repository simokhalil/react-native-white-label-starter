/* eslint-disable */
const fs = require('fs-extra');
const {
  parallel, series, src, dest,
} = require('gulp');
const { argv } = require('yargs');
const { exec } = require('child_process');
require('dotenv').config({ path: 'config/.env' });

console.log('APP_PIN : ', process.env.APP_PIN);

const tenant = argv.tenant || 'main';
const platform = argv.platform || 'ios';

const sourceIosIcons = `./tenant_config/${tenant}/ios/AppIcon.appiconset/**/*`;
const destinationIosIcons = './ios/RNWhiteLabel/Images.xcassets/AppIcon.appiconset';
const sourceIosSplash = `./tenant_config/${tenant}/ios/LaunchImage.launchimage/*`;
const destinationIosSplash = './ios/RNWhiteLabel/Images.xcassets/LaunchImage.launchimage';

const sourceAndroid = `./tenant_config/${tenant}/android/res/**/*`;
const destinationAndroid = './android/app/src/main/res/';
const sourceAndroidManifest = `./tenant_config/${tenant}/android/src/main/AndroidManifest.xml`;
const destinationAndroidManifest = './android/app/src/main/';

const sourceEnvFiles = `./tenant_config/${tenant}/config/*`;
const destinationEnvFiles = './config';


/**
 * *************************************
 * IOS
 **************************************
 */

const cleanIosFiles = () => {
  fs.removeSync(destinationIosIcons);
  fs.removeSync(destinationIosSplash);

  return Promise.resolve('Clean ok');
};

const copyIosIcons = () => {
  fs.ensureDirSync(destinationIosIcons);

  return src(sourceIosIcons)
    .pipe(dest(destinationIosIcons));
};

const copyIosSplashscreen = () => {
  fs.ensureDirSync(destinationIosSplash);

  return src(sourceIosSplash)
    .pipe(dest(destinationIosSplash));
};

const copyIosFiles = series(copyIosIcons, copyIosSplashscreen);

const switchIosFiles = series(cleanIosFiles, copyIosFiles);

/**
 * *************************************
 * ANDROID
 **************************************
 */

const cleanAndroidFiles = () => {
  fs.removeSync(destinationAndroid);

  return Promise.resolve('Clean ok');
};

const copyAndroidFiles = () => {
  fs.ensureDirSync(destinationAndroid);

  if (fs.existsSync(sourceAndroidManifest)) {
    src(sourceAndroidManifest)
      .pipe(dest(destinationAndroidManifest, { overwrite: true }));
  }

  return src(sourceAndroid)
    .pipe(dest(destinationAndroid));
};

const switchAndroidFiles = series(cleanAndroidFiles, copyAndroidFiles);
/**
 * *************************************
 * CONFIG (ENV files)
 **************************************
 */

const cleanEnvFiles = () => {
  console.log('Switching ', platform, 'to ', tenant);

  fs.removeSync(destinationEnvFiles);
  return Promise.resolve('Clean ok');
};

const copyEnvFiles = () => {
  fs.ensureDirSync(destinationEnvFiles);

  return src(sourceEnvFiles, { dot: true })
    .pipe(dest(destinationEnvFiles));
};

const switchEnvFiles = series(cleanEnvFiles, copyEnvFiles);

/**
 * *************************************
 * Scripts
 **************************************
 */

exports.startApp = () => {
  console.log('RUN ', `RN_SRC_EXT=${process.env.APP_PIN}.js node node_modules/react-native/local-cli/cli.js start --reset-cache`);
  const startCmd = exec(`RN_SRC_EXT=${process.env.APP_PIN}.js node node_modules/react-native/local-cli/cli.js start --reset-cache`);
  return startCmd.stdout.pipe(process.stdout);
};

/**
 * *************************************
 * EXPORTS
 **************************************
 */

if (platform === 'android') {
  exports.switchTenant = series(switchAndroidFiles, switchEnvFiles);
  exports.cleanFiles = cleanAndroidFiles;
} else {
  exports.switchTenant = series(switchIosFiles, switchEnvFiles);
  exports.cleanFiles = cleanIosFiles;
}

exports.default = series(
  switchEnvFiles,
  switchAndroidFiles,
  switchIosFiles,
);

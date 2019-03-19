module.exports = {
  presets: [
    "module:metro-react-native-babel-preset",
  ],
  "plugins": [
    // Ignored since handeled directly by Metro bundler through rn-cli.config.js
    ["import-customization", { "env": "APP_PIN_TEST" }],
  ],
};

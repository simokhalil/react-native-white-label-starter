import Config from 'react-native-config';

const tenantConfigs = {
  main: require('./main/config'),
  tenant2: require('./tenant2/config'),
};

export default tenantConfigs[Config.APP_PIN].default;

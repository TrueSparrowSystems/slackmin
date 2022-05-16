const _inMemoryConfig = {};

class ConfigProvider {
  constructor() {
  }

  getConfig() {
      return _inMemoryConfig;
  }

  setConfig(configs){

    if (!Array.isArray(configs)) {
      throw new Error('Array of Object is required.');
    }

    for( let index =0; index < configs.length ; index++ ) {
       const config = configs[index];
        _inMemoryConfig[config.id] = {
          id: config.id,
          secret: config.secret,
          bot_token: config.bot_token
        };
      }
    }
}

module.exports = new ConfigProvider();


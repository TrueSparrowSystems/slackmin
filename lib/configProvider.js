const _inMemoryConfig = {};

class ConfigProvider {
  constructor() {
  }

  getFor(key){
    return _inMemoryConfig[key];
  }

  getConfig() {
    return _inMemoryConfig;
  }

  set(key, value) {
    _inMemoryConfig[key] = value;
  }

}

module.exports = new ConfigProvider();


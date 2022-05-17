const _inMemoryConfig = {};

class ConfigProvider {
  constructor() {
  }

  getFor(key){
    return _inMemoryConfig[key];
  }

  set(key, value) {
    _inMemoryConfig[key] = value;
  }

}

module.exports = new ConfigProvider();


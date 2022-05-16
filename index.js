const rootPrefix = '.',
  configProvider = require(rootPrefix + '/lib/configProvider');

class SlackAdmin {
  constructor(appConfigs, whitelistedChannelIds) {

  }

  get middlewares() {
    return {
      formatPayload: null,
      sanitizeBodyAndQuery: null,
      extractSlackParams: null,
      validateSignature: null,
      validateSlackUser: null
    }
  }
}

module.exports = SlackAdmin;

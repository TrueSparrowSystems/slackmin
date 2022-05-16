const rootPrefix = '.',
  configProvider = require(rootPrefix + '/lib/configProvider');

class SlackAdmin {
  constructor(appConfigs, whitelistedChannelIds) {
    configProvider.setConfig(appConfigs);
  }

  get middlewares() {
    return {
      formatPayload: null,
      sanitizeBodyAndQuery: null,
      extractSlackParams: null,
      validateSignature: null,
      validateSlackUser: null,
      validateSlackChannel: null,
      validateSlackApiAppId: null,
      extractResponseUrlFromPayload: null,
      extractText: null,
      extractResponseUrlFromBody: null
    }
  }
}

module.exports = SlackAdmin;

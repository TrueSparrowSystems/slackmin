const rootPrefix = '.',
  configProvider = require(rootPrefix + '/lib/configProvider'),
  formatPayload = require(rootPrefix + '/middlewares/formatPayload'),
  extractResponseUrlFromPayload = require(rootPrefix + '/middlewares/extractResponseUrlFromPayload'),
  extractText = require(rootPrefix + '/middlewares/extractText'),
  extractSlackParams = require(rootPrefix + '/middlewares/extractSlackParams');
  

class SlackAdmin {
  constructor(appConfigs, whitelistedChannelIds) {
    configProvider.set('app_config',appConfigs);
    configProvider.set('whitelisted_channel_ids',whitelistedChannelIds);
  }

  get middlewares() {
    return {
      formatPayload: formatPayload,
      sanitizeBodyAndQuery: null,
      extractSlackParams: extractSlackParams,
      validateSignature: null,
      validateSlackUser: null,
      validateSlackChannel: null,
      validateSlackApiAppId: null,
      extractResponseUrlFromPayload: extractResponseUrlFromPayload,
      extractText: extractText,
      extractResponseUrlFromBody: null
    }
  }
}

module.exports = SlackAdmin;

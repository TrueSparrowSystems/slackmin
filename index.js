const rootPrefix = '.',
  configProvider = require(rootPrefix + '/lib/configProvider'),
  formatPayload = require(rootPrefix + '/middlewares/formatPayload'),
  extractSlackParams = require(rootPrefix + '/middlewares/extractSlackParams'),
  sanitizer = require(rootPrefix + '/helpers/sanitizer');
  

class SlackAdmin {
  constructor(appConfigs, whitelistedChannelIds) {
    configProvider.set('app_config',appConfigs);
    configProvider.set('whitelisted_channel_ids',whitelistedChannelIds);
  }

  get middlewares() {
    return {
      formatPayload: formatPayload,
      sanitizeBodyAndQuery: sanitizer.sanitizeBodyAndQuery,
      sanitizeDynamicUrlParams: sanitizer.sanitizeDynamicUrlParams,
      sanitizeHeaderParams: sanitizer.sanitizeHeaderParams,
      extractSlackParams: extractSlackParams,
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

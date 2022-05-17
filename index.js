const rootPrefix = '.',
  configProvider = require(rootPrefix + '/lib/configProvider'),
  formatPayload = require(rootPrefix + '/middlewares/formatPayload'),
  sanitizer = require(rootPrefix + '/helpers/sanitizer'),
  extractResponseUrlFromPayload = require(rootPrefix + '/middlewares/extractResponseUrlFromPayload'),
  extractText = require(rootPrefix + '/middlewares/extractText'),
  extractResponseUrlFromBody = require(rootPrefix + '/middlewares/extractResponseUrlFromBody'),
  extractSlackParams = require(rootPrefix + '/middlewares/extractSlackParams'),
  parseApiParameters = require(rootPrefix + '/middlewares/parseApiParams'),
  authenticator = require(rootPrefix + '/middlewares/authentication/Authenticator');


class SlackAdmin {
  constructor(appConfigs, whitelistedChannelIds) {
    configProvider.set('app_config',appConfigs);
    configProvider.set('whitelisted_channel_ids',whitelistedChannelIds);
    configProvider.set('domain', domain);

  }

  get middlewares() {
    return {
      formatPayload: formatPayload,
      sanitizeBodyAndQuery: sanitizer.sanitizeBodyAndQuery,
      sanitizeDynamicUrlParams: sanitizer.sanitizeDynamicUrlParams,
      sanitizeHeaderParams: sanitizer.sanitizeHeaderParams,
      extractSlackParams: extractSlackParams,
      validateSignature: authenticator.validateSlackSignature,
      validateSlackUser: authenticator.validateSlackApiAppId,
      validateSlackChannel: authenticator.validateSlackChannel,
      validateSlackApiAppId: authenticator.validateSlackApiAppId,
      extractResponseUrlFromPayload: extractResponseUrlFromPayload,
      extractText: extractText,
      extractResponseUrlFromBody: extractResponseUrlFromBody,
      parseApiParameters: parseApiParameters
    }
  }
}

module.exports = SlackAdmin;

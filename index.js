const rootPrefix = '.',
  configProvider = require(rootPrefix + '/lib/configProvider'),
  formatPayload = require(rootPrefix + '/middlewares/formatPayload'),
  sanitizer = require(rootPrefix + '/helpers/sanitizer'),
  extractResponseUrlFromPayload = require(rootPrefix + '/middlewares/extractResponseUrlFromPayload'),
  extractText = require(rootPrefix + '/middlewares/extractText'),
  extractResponseUrlFromBody = require(rootPrefix + '/middlewares/extractResponseUrlFromBody'),
  extractSlackParams = require(rootPrefix + '/middlewares/extractSlackParams'),
  parseApiParameters = require(rootPrefix + '/middlewares/parseApiParams'),
  extractTriggerId = require(rootPrefix + '/middlewares/extractTriggerId'),
  authenticator = require(rootPrefix + '/middlewares/authentication/Authenticator'),
  Message = require(rootPrefix + '/lib/slack/Message'),
  Modal = require(rootPrefix + '/lib/slack/Modal');


class SlackAdmin {
  constructor(appConfigs, whitelistedChannelIds, domain, whitelistedUsers) {
    configProvider.set('app_config',appConfigs);
    configProvider.set('whitelisted_channel_ids',whitelistedChannelIds);
    configProvider.set('domain', domain);
    configProvider.set('whitelisted_users', whitelistedUsers);
  }

  get middlewares() {
    return {
      formatPayload: formatPayload,
      sanitizeBodyAndQuery: sanitizer.sanitizeBodyAndQuery,
      sanitizeDynamicUrlParams: sanitizer.sanitizeDynamicUrlParams,
      sanitizeHeaderParams: sanitizer.sanitizeHeaderParams,
      extractSlackParams: extractSlackParams,
      validateSignature: authenticator.validateSlackSignature,
      validateSlackUser: authenticator.validateSlackUser,
      validateSlackChannel: authenticator.validateSlackChannel,
      validateSlackApiAppId: authenticator.validateSlackApiAppId,
      extractResponseUrlFromPayload: extractResponseUrlFromPayload,
      extractText: extractText,
      extractResponseUrlFromBody: extractResponseUrlFromBody,
      parseApiParameters: parseApiParameters,
      extractTriggerId: extractTriggerId
    }
  }

  get interactiveEndpointMiddlewares(){
    return [
      formatPayload,
      sanitizer.sanitizeBodyAndQuery,
      extractSlackParams,
      authenticator.validateSlackSignature,
      authenticator.validateSlackUser,
      sanitizer.sanitizeDynamicUrlParams,
      sanitizer.sanitizeHeaderParams,
      authenticator.validateSlackApiAppId,
      extractTriggerId,
      extractResponseUrlFromPayload,
      parseApiParameters
    ]
  }

  get slashCommandMiddlewares(){
    return [
      formatPayload,
      sanitizer.sanitizeBodyAndQuery,
      extractSlackParams,
      authenticator.validateSlackSignature,
      authenticator.validateSlackUser,
      authenticator.validateSlackChannel,
      extractText, 
      extractResponseUrlFromBody
    ]
  }

  get interactiveElements(){
    return {
      Message: Message,
      Modal: Modal
    }
  }

}

module.exports = SlackAdmin;

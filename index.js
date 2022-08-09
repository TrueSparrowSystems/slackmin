const rootPrefix = '.',
  configProvider = require(rootPrefix + '/lib/configProvider'),
  slackAppConstants = require(rootPrefix + '/lib/constants/slackApp'),
  slackWrapper = require(rootPrefix + '/lib/slack/Wrapper'),
  formatPayload = require(rootPrefix + '/middlewares/formatPayload'),
  assignParams = require(rootPrefix + '/middlewares/assignParams'),
  sanitizer = require(rootPrefix + '/lib/helpers/sanitizer'),
  extractResponseUrlFromPayload = require(rootPrefix + '/middlewares/extractResponseUrlFromPayload'),
  extractText = require(rootPrefix + '/middlewares/extractText'),
  extractResponseUrlFromBody = require(rootPrefix + '/middlewares/extractResponseUrlFromBody'),
  extractSlackParams = require(rootPrefix + '/middlewares/extractSlackParams'),
  parseApiParameters = require(rootPrefix + '/middlewares/parseApiParams'),
  extractTriggerId = require(rootPrefix + '/middlewares/extractTriggerId'),
  authenticator = require(rootPrefix + '/middlewares/authentication/Authenticator'),
  CommonMiddlewareMethod = require(rootPrefix + '/lib/middlewareMethods/Common'),
  Message = require(rootPrefix + '/lib/slack/Message'),
  Modal = require(rootPrefix + '/lib/slack/Modal');

/**
 * Class for Slack Admin.
 *
 * @class SlackAdmin
 *
 * @param {array} appConfigs
 * @param {object} whitelistedChannelIds
 * @param {string} domain
 * @param {array} whitelistedUsers
 *
 */
class SlackAdmin {
  constructor(appConfigs, whitelistedChannelIds, whitelistedUsers) {
    configProvider.set('app_config', appConfigs);
    configProvider.set('whitelisted_channel_ids', whitelistedChannelIds);
    configProvider.set('whitelisted_users', whitelistedUsers);
    console.log('app_configs------------>', appConfigs);
    console.log('whitelisted_channel_ids------->', whitelistedChannelIds);
    console.log('whitelisted_users-------->', whitelistedUsers);
    slackAppConstants.setSlackAppConfigById();
    slackWrapper.init();
  }

  /**
   * Validator with middleware logic.
   *
   * @returns {{common}}
   */
  get validators() {
    return {
      common : CommonMiddlewareMethod
    }
  }

  /**
   * Slack admin common middlewares
   *
   * @returns {(*|Sanitizer.sanitizeBodyAndQuery|Authenticator.validateSlackSignature)[]}
   */
  get commonMiddlewares() {
    const oThis = this;

    return function(req, res, next) {
      let response;
      try {
        response = oThis.validators.common(req.body, req.rawBody, req.query, req.headers, req.method)
      } catch {
        return res.status(200).json('Something went wrong.');
      }

      req.body = response.requestBody;
      req.query = response.requestQuery;
      req.internalDecodedParams = response.internalDecodedParams;
      req.decodedParams = response.decodedParams;

      next();
    };
  }

  /**
   * Slack admin interactive endpoints middlewares
   *
   * @returns {(Sanitizer.sanitizeDynamicUrlParams|Sanitizer.sanitizeHeaderParams|Authenticator.validateSlackApiAppId|*)[]}
   */
  get interactiveEndpointMiddlewares() {
    return [
      sanitizer.sanitizeDynamicUrlParams,
      sanitizer.sanitizeHeaderParams,
      authenticator.validateSlackApiAppId,
      extractTriggerId,
      extractResponseUrlFromPayload,
      parseApiParameters
    ];
  }

  /**
   * Slack command middlewares
   *
   * @returns {(Authenticator.validateSlackChannel|*)[]}
   */
  get slashCommandMiddlewares() {
    return [authenticator.validateSlackChannel, extractText, extractResponseUrlFromBody];
  }

  /**
   * Slack interactive element middlewares
   *
   * @returns {{Message, Modal}}
   */
  get interactiveElements() {
    return {
      Message: Message,
      Modal: Modal
    };
  }
}

module.exports = SlackAdmin;

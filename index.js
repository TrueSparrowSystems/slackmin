const rootPrefix = '.',
  configProvider = require(rootPrefix + '/lib/configProvider'),
  slackAppConstants = require(rootPrefix + '/lib/constants/slackApp'),
  slackWrapper = require(rootPrefix + '/lib/slack/Wrapper'),
  formatPayload = require(rootPrefix + '/middlewares/formatPayload'),
  assignRawBody = require(rootPrefix + '/middlewares/assignRawBody'),
  assignParams = require(rootPrefix + '/middlewares/assignParams'),
  sanitizer = require(rootPrefix + '/lib/helpers/sanitizer'),
  extractResponseUrlFromPayload = require(rootPrefix + '/middlewares/extractResponseUrlFromPayload'),
  extractText = require(rootPrefix + '/middlewares/extractText'),
  extractResponseUrlFromBody = require(rootPrefix + '/middlewares/extractResponseUrlFromBody'),
  extractSlackParams = require(rootPrefix + '/middlewares/extractSlackParams'),
  parseApiParameters = require(rootPrefix + '/middlewares/parseApiParams'),
  extractTriggerId = require(rootPrefix + '/middlewares/extractTriggerId'),
  authenticator = require(rootPrefix + '/middlewares/authentication/Authenticator'),
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
  constructor(appConfigs, whitelistedChannelIds, domain, whitelistedUsers) {
    configProvider.set('app_config', appConfigs);
    configProvider.set('whitelisted_channel_ids', whitelistedChannelIds);
    configProvider.set('domain', domain);
    configProvider.set('whitelisted_users', whitelistedUsers);
    console.log('app_configs------------>>>>>>>>', app_configs);
    console.log('whitelisted_channel_ids------->', whitelisted_channel_ids);
    console.log('domain-------->', domain);
    console.log('whitelisted_users-------->', whitelisted_users);
    slackAppConstants.setSlackAppConfigById();
    slackWrapper.init();
  }

  /**
   * Slack admin common middlewares
   *
   * @returns {(*|Sanitizer.sanitizeBodyAndQuery|Authenticator.validateSlackSignature)[]}
   */
  get commonMiddlewares() {
    return [
      assignRawBody,
      formatPayload,
      sanitizer.sanitizeBodyAndQuery,
      assignParams,
      extractSlackParams,
      authenticator.validateRawBodyParams,
      authenticator.validateRequestHeaders,
      authenticator.validateRequestDomain,
      authenticator.validateSlackSignature,
      authenticator.validateSlackUser
    ];
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

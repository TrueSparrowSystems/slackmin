const rootPrefix = '.',
  configProvider = require(rootPrefix + '/lib/configProvider'),
  slackAppConstants = require(rootPrefix + '/lib/constants/slackApp'),
  slackWrapper = require(rootPrefix + '/lib/slack/Wrapper'),
  CommonMiddlewares = require(rootPrefix + '/lib/middlewareMethods/Common'),
  InteractiveMiddlewares = require(rootPrefix + '/lib/middlewareMethods/Interactive'),
  SlashCommandMiddlewares = require(rootPrefix + '/lib/middlewareMethods/SlashCommand'),
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
    slackAppConstants.setSlackAppConfigById();
    slackWrapper.init();
  }

  /**
   * Validator methods : Exposed methods for common, slash command and interactive endpoint validations
   *
   * @returns {{common: *, slashCommands: *, interactive: *}}
   */
  get validators() {
    return {
      common: CommonMiddlewares.CommonMiddleWareMethod,
      interactive: InteractiveMiddlewares.InteractiveMiddleWareMethod,
      slashCommands: SlashCommandMiddlewares.SlashCommandMiddlewareMethod
    };
  }

  /**
   * Slack admin common middlewares
   *
   * @returns {function(...[*]=)}
   */
  get commonMiddlewares() {
    const oThis = this;

    return async function(req, res, next) {
      try {
        const response = await oThis.validators.common(
          req.body,
          req.rawBody,
          req.query,
          req.headers,
          req.method
        );

        req.body = response.requestBody;
        req.query = response.requestQuery;
        req.internalDecodedParams = response.internalDecodedParams;
        req.decodedParams = response.decodedParams;
        next();
      } catch (errorMessage) {
        console.error('Common middleware error:', errorMessage);
        return res.status(200).json('Something went wrong.');
      }
    };
  }

  /**
   * Slack admin interactive endpoints middlewares
   *
   * @returns {function(...[*]=)}
   */
  get interactiveEndpointMiddlewares() {
    const oThis = this;

    return async function(req, res, next) {
      try {
        const response = await oThis.validators.interactive(
          req.params,
          req.body,
          req.headers,
          req.decodedParams,
          req.internalDecodedParams
        );
        req.params = response.requestParams;
        req.sanitizedHeaders = response.internalDecodedParams.headers;
        req.internalDecodedParams = response.internalDecodedParams;
        req.decodedParams = response.decodedParams;

        next();
      } catch (err) {
        console.log('Error in interactive endpoint middleware:', err);
        console.error('Interactive endpoint middleware error:', JSON.stringify(err));
        return res.status(200).json('something_went_wrong');
      }
    };
  }

  /**
   * Slack command middlewares
   *
   * @returns {function(...[*]=)}
   */
  get slashCommandMiddlewares() {
    const oThis = this;

    return async function(req, res, next) {
      try {
        const response = await oThis.validators.slashCommands(req.body, req.rawBody, req.headers, req.decodedParams);
        req.body = response.requestBody;
        req.decodedParams = response.decodedParams;
        next();
      } catch (err) {
        console.error('Slash command middleware error:', JSON.stringify(err));
        return res.status(200).json('Something went wrong.');
      }
    };
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

const qs = require('qs');

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
    console.log('app_configs------------>', appConfigs);
    console.log('whitelisted_channel_ids------->', whitelistedChannelIds);
    console.log('whitelisted_users-------->', whitelistedUsers);
    slackAppConstants.setSlackAppConfigById();
    slackWrapper.init();
  }

  /**
   * Middleware methods : Exposed methods for common, slash command and interactive endpoint middlewares
   *
   * @returns {{common: *, slashCommands: *, interactive: *}}
   */
  get middlewareMethods() {
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
      let response;
      try {
        response = await oThis.middlewareMethods.common(req.body, req.rawBody, req.query, req.headers, req.method);
      } catch (errorMessage) {
        console.error('Common middleaware error--------', errorMessage);
        return res.status(200).json('Something went wrong.');
      }

      console.log('response=============>', JSON.stringify(response));
      req.body = response.requestBody;
      req.query = response.requestQuery;
      req.internalDecodedParams = response.internalDecodedParams;
      req.decodedParams = response.decodedParams;
      console.log('req.body=============>', JSON.stringify(req.body));

      next();
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
      let response;
      try {
        response = await oThis.middlewareMethods.interactive(
          req.params,
          req.body,
          req.rawBody,
          req.headers,
          req.decodedParams,
          req.internalDecodedParams
        );
      } catch (err) {
        console.error('Interactive endpoint middleware error-------------', JSON.stringify(err));

        return res.status(200).json('something_went_wrong');
      }

      console.log('interactive response=============>', JSON.stringify(response));
      req.params = response.requestParams;
      req.sanitizedHeaders = response.internalDecodedParams.headers;
      req.internalDecodedParams = response.internalDecodedParams;
      req.decodedParams = response.decodedParams;

      next();
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
      let response;
      try {
        console.log(' Started executing slash command middlewares=======================');
        response = await oThis.middlewareMethods.slashCommands(req.body, req.rawBody, req.headers, req.decodedParams);
      } catch (err) {
        console.error('Slash command middleware error-------------', JSON.stringify(err));
        return res.status(200).json('Something went wrong.');
      }

      console.log('slashCommandMiddlewares :: response=============>', JSON.stringify(response));
      req.body = response.requestBody;
      req.decodedParams = response.decodedParams;
      console.log('slashCommandMiddlewares :: req.body=============>', JSON.stringify(req.body));

      next();
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

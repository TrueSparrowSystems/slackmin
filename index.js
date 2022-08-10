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
   * Validator with middleware logic.
   *
   * @returns {{common}}
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
   * @returns {(*|Sanitizer.sanitizeBodyAndQuery|Authenticator.validateSlackSignature)[]}
   */
  get commonMiddlewares() {
    const oThis = this;

    return async function(req, res, next) {
      console.log('req.rawBody===================>>>>>>>>', req.rawBody);
      console.log('req.body===================>>>>>>>>', req.body);
      console.log('qs.stringify(req.body)===================>>>>>>>>', qs.stringify(req.body));

      const a = qs.stringify(req.body);
      const body = a.replace(/%20/g, '+');
      console.log('body=======================>>>>>>>>', body);
      console.log('compare =======================>>>>>>>>', body === req.rawBody);
      req.rawBody = body;

      let response;
      try {
        response = await oThis.validators.common(req.body, req.rawBody, req.query, req.headers, req.method);
      } catch {
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
   * @returns {(Sanitizer.sanitizeDynamicUrlParams|Sanitizer.sanitizeHeaderParams|Authenticator.validateSlackApiAppId|*)[]}
   */
  get interactiveEndpointMiddlewares() {
    const oThis = this;

    return async function(req, res, next) {
      let response;
      try {
        response = await oThis.validators.interactive(
          req.params,
          req.body,
          req.rawBody,
          req.headers,
          req.decodedParams,
          req.internalDecodedParams
        );
      } catch (err) {
        console.log('interactiveEndpoint error ------>', JSON.stringify(err), typeof err);

        return res.status(200).json(err);
      }

      console.log('interactive response=============>', JSON.stringify(response));
      //decodedParams, internalDecodedParams, requestParams
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
   * @returns {(Authenticator.validateSlackChannel|*)[]}
   */
  get slashCommandMiddlewares() {
    const oThis = this;

    return async function(req, res, next) {
      let response;
      try {
        console.log(' Started executing slash command middlewares=======================');
        response = await oThis.validators.slashCommands(req.body, req.rawBody, req.headers, req.decodedParams);
      } catch {
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

const { App } = require('@slack/bolt');

const rootPrefix = '../..',
  slackAppConstants = require(rootPrefix + '/lib/constants/slackApp'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper');

/**
 * Class for slack wrapper.
 *
 * @class Wrapper
 */
class Wrapper {
  /**
   * Constructor for slack wrapper.
   *
   * @constructor
   */
  constructor() {
    const oThis = this;

    oThis.appsByIdMap = {};
    oThis.slackAppConfigs = {};

    // If slack domain is not passed while sending message, this app is used.
    oThis.defaultAppDetails = null;

    oThis.slackDomainToDefaultAppDetailsMap = {};
  }

  /**
   * Initialise slack app object
   *
   * @sets oThis.slackAppConfigs, oThis.appsByIdMap
   */
  init() {
    const oThis = this;

    oThis.slackAppConfigs = slackAppConstants.getAppConfigs();

    for (const appId in oThis.slackAppConfigs) {
      const slackAppConfig = oThis.slackAppConfigs[appId];
      const slackBotToken = slackAppConfig.slack_bot_user_oauth_token;
      const signingSecret = slackAppConfig.secret;
      const slackDomain = slackAppConfig.slack_domain;

      const slackApp = new App({
        token: slackBotToken,
        signingSecret: signingSecret
      });

      oThis.appsByIdMap[slackAppConfig.id] = slackApp;

      // Set default app, if not set.
      if (!oThis.defaultAppDetails) {
        oThis.defaultAppDetails = {
          app: slackApp,
          appConfig: slackAppConfig
        };
      }

      // Set default app for slack domain
      if (!oThis.slackDomainToDefaultAppDetailsMap[slackDomain]) {
        oThis.slackDomainToDefaultAppDetailsMap[slackDomain] = {
          app: slackApp,
          appConfig: slackAppConfig
        };
      }
    }
  }

  /**
   * Send message to a channel using chat.postMessage API of Slack.
   * NOTE: https://api.slack.com/methods/chat.postMessage
   *
   * @param {object} messageParams
   *
   * @returns {Promise<result>}
   */
  async chatPostMessage(messageParams) {
    const oThis = this;

    const slackAppDetails = messageParams.slackDomain
      ? oThis.slackDomainToDefaultAppDetailsMap[messageParams.slackDomain]
      : oThis.defaultAppDetails;

    return slackAppDetails.app.client.chat
      .postMessage({
        token: slackAppDetails.appConfig.slack_bot_user_oauth_token,
        channel: messageParams.channel,
        blocks: messageParams.blocks,
        // text acts as fall back in case of mobile notification for message
        text: messageParams.text
      })
      .then(() => {
        return responseHelper.successWithData({});
      })
      .catch((error) => {
        console.error('Error in slack::send postMessage api: ', error);

        return responseHelper.error({
          internal_error_identifier: 'l_s_w_cpm_1',
          api_error_identifier: 'something_went_wrong',
          debug_options: { message: error.message }
        });
      });
  }
}

module.exports = new Wrapper();

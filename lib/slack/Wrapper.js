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

    oThis.apps = {};
    oThis.app = {};
    oThis.slackAppConfigs = {};
  }

  /**
   * Initialise slack app object
   *
   * @sets oThis.slackAppConfigs, oThis.apps
   */
  init() {
    const oThis = this;

    oThis.slackAppConfigs = slackAppConstants.getAppConfigs();

    for (const appId in oThis.slackAppConfigs) {
      const slackAppConfig = oThis.slackAppConfigs[appId];
      const slackBotToken = slackAppConfig.slack_bot_user_oauth_token;
      const signingSecret = slackAppConfig.secret;

      oThis.apps[slackAppConfig.id] = new App({
        token: slackBotToken,
        signingSecret: signingSecret
      });
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

    const preApiTimestamp = Date.now();
    let slackAppConfig = null;

    for (const appId in oThis.slackAppConfigs) {
      slackAppConfig = oThis.slackAppConfigs[appId];
      if (!messageParams.domain) {
        oThis.app = oThis.apps[slackAppConfig.id];
        break;
      } else if (slackAppConfig.domain === messageParams.domain) {
        oThis.app = oThis.apps[slackAppConfig.id];
        break;
      }
    }

    return oThis.app.client.chat
      .postMessage({
        token: slackAppConfig.slack_bot_user_oauth_token,
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

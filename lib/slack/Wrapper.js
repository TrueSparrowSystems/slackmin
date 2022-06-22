const { App } = require('@slack/bolt');

const rootPrefix = '../..',
  configProvider = require(rootPrefix + '/lib/configProvider'),
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

    oThis.slackBotToken = null;
    oThis.app = {};
  }

  /**
   * Initialise slack app object
   *
   * @sets oThis.slackBotToken, oThis.app
   */
  init() {
    const oThis = this;

    const slackAppConfigs = configProvider.getFor('app_config');

    // We can take any config object as default for sending the chat messages on channel.
    oThis.slackBotToken = slackAppConfigs[0].slack_bot_user_oauth_token;
    const signingSecret = slackAppConfigs[0].secret;

    oThis.app = new App({
      token: oThis.slackBotToken,
      signingSecret: signingSecret
    });
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

    return oThis.app.client.chat
      .postMessage({
        token: oThis.slackBotToken,
        channel: messageParams.channel,
        blocks: messageParams.blocks,
        text: messageParams.text
      })
      .then(() => {
        console.info('(' + (Date.now() - preApiTimestamp) + ' ms)', JSON.stringify(messageParams));

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

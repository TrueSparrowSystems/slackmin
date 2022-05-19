const Slack = require('slack');

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

    const slackAppConfigs = configProvider.getFor('app_config');

    // Initialize slack object. Assumption - we will use take 0 config object as default token for sending the chat message.
    oThis.slackObj = new Slack({ token: slackAppConfigs[0].bot_token });
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

    return oThis.slackObj.chat
      .postMessage(messageParams)
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

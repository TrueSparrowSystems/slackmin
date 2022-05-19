const rootPrefix = '../..',
  SlackAuthenticationBase = require(rootPrefix + '/middlewares/authentication/Base'),
  configProvider = require(rootPrefix + '/lib/configProvider');

/**
 * Class to validate slack channel.
 *
 * @class ValidateSlackChannel
 */
class ValidateSlackChannel extends SlackAuthenticationBase {
  /**
   * Constructor to validate slack channel.
   *
   * @param {object} params
   * @param {string} params.rawBody
   * @param {object} params.requestHeaders
   * @param {object} params.slackRequestParams
   * @param {string} params.slackRequestParams.channel_id
   *
   * @augments SlackAuthenticationBase
   *
   * @constructor
   */
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.channelId = oThis.slackRequestParams.channel_id;

    console.log('Channel ID: ', oThis.channelId);
  }

  /**
   * Perform channel ID validation specific operations.
   *
   * @returns {Promise<result|never>}
   * @private
   */
  async _performSpecificValidations() {
    const oThis = this;

    return oThis._validateSlackChannel();
  }

  /**
   * Validate slack channel.
   *
   * @returns {Promise<never|result>}
   * @private
   */
  async _validateSlackChannel() {
    const oThis = this;

    const configs = configProvider.getFor('whitelisted_channel_ids');
    let index = configs.indexOf(oThis.channelId);
    if(index == -1) {
      throw new Error(`Invalid  channelId :: ${oThis.channelId}`);
    }

  }


}

module.exports = ValidateSlackChannel;

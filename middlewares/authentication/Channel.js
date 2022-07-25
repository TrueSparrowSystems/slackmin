const rootPrefix = '../..',
  SlackAuthenticationBase = require(rootPrefix + '/middlewares/authentication/Base'),
  configProvider = require(rootPrefix + '/lib/configProvider');

/**
 * Class to validate slack channel.
 *
 * @class ValidateSlackChannel
 *
 * @param {object} params
 * @param {string} params.rawBody
 * @param {object} params.requestHeaders
 * @param {object} params.slackRequestParams
 * @param {string} params.slackRequestParams.channel_id
 *
 * @augments SlackAuthenticationBase
 *
 */
class ValidateSlackChannel extends SlackAuthenticationBase {
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.channelId = oThis.slackRequestParams.channel_id;
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
   * Validates if slack channel is present in whitelisted_channel_ids list.
   *
   * @returns {Promise<never|result>}
   * @private
   */
  async _validateSlackChannel() {
    const oThis = this;

    const whitelistedChannelIds = configProvider.getFor('whitelisted_channel_ids');

    if (!whitelistedChannelIds.includes(oThis.channelId)) {
      throw new Error(`Invalid  channelId :: ${oThis.channelId}`);
    }
  }
}

module.exports = ValidateSlackChannel;

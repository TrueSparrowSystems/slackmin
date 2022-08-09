const rootPrefix = '../..',
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper'),
  configProvider = require(rootPrefix + '/lib/configProvider');

/**
 * Class to validate slack channel.
 *
 * @class ValidateSlackChannel
 *
 * @param {object} params
 * @param {object} params.slackRequestParams
 *
 * @class ValidateSlackChannel
 *
 */
class ValidateSlackChannel {
  constructor(params) {
    const oThis = this;

    oThis.slackRequestParams = params.slackRequestParams;

    oThis.channelId = oThis.slackRequestParams.channel_id;
  }

  /**
   * Perform channel ID validation specific operations.
   *
   * @returns {Promise<result|never>}
   * @private
   */
  async perform() {
    const oThis = this;

    const whitelistedChannelIds = configProvider.getFor('whitelisted_channel_ids');

    if (whitelistedChannelIds.length === 0) {
      return;
    }

    if (!whitelistedChannelIds.includes(oThis.channelId)) {
      console.error(`Slack authentication failed. Invalid whitelistedChannelIds: ${whitelistedChannelIds}`);
      return responseHelper.error({
        internal_error_identifier: 'm_a_c_p',
        api_error_identifier: 'unauthorized_api_request',
        debug_options: { slackRequestParams: oThis.slackRequestParams, channelId: oThis.channelId }
      });
    }

    return oThis._prepareResponse();
  }

  /**
   * Prepare response.
   *
   * @returns {result}
   * @private
   */
  _prepareResponse() {
    return responseHelper.successWithData({});
  }
}

module.exports = ValidateSlackChannel;

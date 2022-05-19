const rootPrefix = '../..',
  HttpLibrary = require(rootPrefix + '/lib/HttpRequest'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper'),
  slackConstants = require(rootPrefix + '/lib/constants/slackConstants');

/**
 * Class for slack helper.
 *
 * @class SlackHelper
 */
class SlackHelper {
  /**
   * Send message using response url.
   *
   * Ephemeral messages: https://api.slack.com/messaging/managing#ephemeral
   * One responseUrl can be used only 5 times.
   *
   * @param {object} params
   * @param {boolean} [params.isEphemeral]
   * @param {string} params.text
   * @param {array} [params.blocks]
   * @param {string} params.responseUrl
   *
   * @returns {Promise<never>}
   */
  async sendMessageUsingResponseUrl(params) {
    const isEphemeral = params.isEphemeral || false;
    const text = params.text;
    const responseUrl = params.responseUrl;
    const blocks = params.blocks || [];

    if (!responseUrl) {
      return Promise.reject(
        responseHelper.error({
          internal_error_identifier: 'l_s_h_smuru_1',
          api_error_identifier: 'something_went_wrong',
          debug_options: { params: params }
        })
      );
    }

    const responseType = isEphemeral ? slackConstants.ephemeralResponseType : slackConstants.inChannelResponseType;

    const messageObject = {
      response_type: responseType,
      text: text || '',
      blocks: blocks
    };

    const httpLibObj = new HttpLibrary({ resource: responseUrl, noFormattingRequired: true });

    const responseData = await httpLibObj.post(JSON.stringify(messageObject)).catch(function(err) {
      return err;
    });

    const httpResponseCode = responseData.data.response.status;
    const httpResponseMessage = responseData.data.responseData;
    if (httpResponseCode !== 200 || httpResponseMessage !== 'ok') {
      return Promise.reject(responseData);
    }

    return responseHelper.successWithData({});
  }
}

module.exports = new SlackHelper();

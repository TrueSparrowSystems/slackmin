const rootPrefix = '../..',
  CommonValidators = require(rootPrefix + '/lib/validator/Common'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper'),
  configProvider = require(rootPrefix + '/lib/configProvider');

/**
 * Base class to validate requests from slack.
 *
 * @class SlackAuthenticationBase
 *
 * @param {object} params
 * @param {string} params.rawBody
 * @param {object} params.requestHeaders
 * @param {object} params.slackRequestParams
 *
 */
class SlackAuthenticationBase {
  /**
   * Constructor for base class to validate requests from slack.
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.rawBody = params.rawBody;
    oThis.requestHeaders = params.requestHeaders;
    oThis.slackRequestParams = params.slackRequestParams;

    oThis.requestPayload = oThis.slackRequestParams.payload || null;
  }

  /**
   * Main performer for class.
   *
   * @return {Promise<*|result>}
   */
  async perform() {
    const oThis = this;

    try {
      await oThis._performSpecificValidations();
    } catch (error) {
      console.error('Slack authentication failed.');

      return responseHelper.error({
        internal_error_identifier: 'l_a_sr_p_1',
        api_error_identifier: 'unauthorized_api_request',
        debug_options: { body: oThis.rawBody, headers: oThis.requestHeaders }
      });
    }

    return oThis._prepareResponse();
  }

  /**
   * Perform class specific validations here.
   *
   * @returns {Promise<void>}
   * @private
   */
  async _performSpecificValidations() {
    throw new Error('Sub-class to implement');
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

module.exports = SlackAuthenticationBase;

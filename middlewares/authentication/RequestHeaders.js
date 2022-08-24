const rootPrefix = '../..',
  CommonValidators = require(rootPrefix + '/lib/validator/Common'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper');

/**
 * Class for validating request header
 *
 * @class ValidateRequestHeaders
 */
class ValidateRequestHeaders {
  /**
   * Constructor for  class to validate request headers from slack.
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.requestHeaders = params.requestHeaders;
  }

  /**
   * Main performer for class.
   *
   * @return {Promise<*|result>}
   */
  async perform() {
    const oThis = this;

    try {
      await oThis._validateRequestHeaders();

      await oThis._validateRequestTimestamp();
    } catch (error) {
      console.error('Slack authentication failed.');

      return responseHelper.error({
        internal_error_identifier: 'm_a_rh_p',
        api_error_identifier: 'unauthorized_api_request',
        debug_options: { headers: oThis.requestHeaders }
      });
    }

    return oThis._prepareResponse();
  }

  /**
   * Validate request headers.
   *
   * @return {Promise<*>}
   * @private
   */
  async _validateRequestHeaders() {
    const oThis = this;

    if (!CommonValidators.validateNonEmptyObject(oThis.requestHeaders)) {
      throw new Error(`Invalid slack request header params :: ${oThis.requestHeaders}`);
    }
  }

  /**
   * Validate request timestamp.
   *
   * @returns {Promise<result>}
   * @private
   */
  async _validateRequestTimestamp() {
    const oThis = this;

    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);

    const requestTimestamp = Number(oThis.requestHeaders['x-slack-request-timestamp']);
    const eventExpiryTimestamp = 5 * 60;

    if (
      !CommonValidators.validateTimestamp(requestTimestamp) ||
      requestTimestamp > currentTimestampInSeconds ||
      requestTimestamp < currentTimestampInSeconds - eventExpiryTimestamp
    ) {
      throw new Error(`Invalid  request timstamp :: ${requestTimestamp}`);
    }
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

module.exports = ValidateRequestHeaders;

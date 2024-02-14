const rootPrefix = '../..',
  CommonValidators = require(rootPrefix + '/lib/validator/Common'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper');

/**
 * Class for validating raw body params
 *
 * @class ValidateRawBodyParams
 */
class ValidateRawBodyParams {
  /**
   * Constructor for  class to validate raw body params from slack request.
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    console.log('type of params.rawBody: ------- ', typeof params.rawBody);
    console.log('params: ------- ', params);
    oThis.rawBody = params.rawBody;
  }

  /**
   * Main performer for class.
   *
   * @return {Promise<*|result>}
   */
  async perform() {
    const oThis = this;

    if (!CommonValidators.validateString(oThis.rawBody)) {
      console.error(`Slack authentication failed. Invalid raw Body Input ${JSON.stringify(oThis.rawBody)}`);
      return responseHelper.error({
        internal_error_identifier: 'm_a_rbp_p',
        api_error_identifier: 'unauthorized_api_request',
        debug_options: { body: oThis.rawBody }
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

module.exports = ValidateRawBodyParams;

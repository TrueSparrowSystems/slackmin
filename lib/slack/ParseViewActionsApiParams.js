const rootPrefix = '../..',
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper'),
  slackConstants = require(rootPrefix + '/lib/constants/slackConstants');

/**
 * Class to create API params from view submission type API calls.
 *
 * @class ParseViewSubmissionApiParams
 */
class ParseViewSubmissionApiParams {
  /**
   * Constructor to create API params from view submission type API calls.
   *
   * @param {object} params
   * @param {object} params.payload
   * @param {string} params.payload.type
   * @param {object} params.payload.view
   * @param {string} params.payload.view.private_metadata
   * @param {array<object>} params.payload.view.blocks
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.slackPayload = params.payload;

    oThis.finalResponse = { action: '', hiddenParams: {} };
  }

  /**
   * Main performer for class.
   *
   * @returns {Promise<void>}
   */
  async perform() {
    const oThis = this;

    await oThis._validateAndSanitize();

    await oThis._setFinalResponse();

    return responseHelper.successWithData(oThis.finalResponse);
  }

  /**
   * Validate and sanitize input data.
   *
   * @returns {Promise<result>}
   * @private
   */
  async _validateAndSanitize() {
    const oThis = this;

    if (oThis.slackPayload.type !== slackConstants.blockActionsPayloadType) {
      return oThis.invalidParams('l_s_gbaap_vas_1');
    }
  }

  /**
   * Set final response.
   *
   * @sets oThis.finalResponse
   *
   * @returns {Promise<result>}
   * @private
   */
  async _setFinalResponse() {
    const oThis = this;

    const actionObject = oThis.slackPayload.actions[0];

    let parsedValue = {};

    try {
      parsedValue = JSON.parse(actionObject.value);
    } catch (error) {
      console.error('Error: ', error);

      return oThis.invalidParams('l_s_gbaap_sfr_1');
    }

    if (!parsedValue.action || !parsedValue.hiddenParams) {
      return oThis.invalidParams('l_s_gbaap_sfr_2');
    }

    oThis.finalResponse.action = parsedValue.action;
    oThis.finalResponse.hiddenParams = parsedValue.hiddenParams;
  }

  /**
   * Invalid params response.
   *
   * @param {string} code
   *
   * @returns {Promise<result>}
   */
  async invalidParams(code) {
    const oThis = this;

    const errorObj = responseHelper.error({
      internal_error_identifier: code,
      api_error_identifier: 'invalid_params',
      debug_options: { slackPayload: oThis.slackPayload }
    });

    return errorObj;
  }
}

module.exports = ParseViewSubmissionApiParams;

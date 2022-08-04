const rootPrefix = '../..',
  slackAppConstants = require(rootPrefix + '/lib/constants/slackApp'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper'),
  CommonValidators = require(rootPrefix + '/lib/validator/Common');

/**
 * Class to validate slack API app ID.
 *
 * @class ValidateSlackApiAppId
 *
 * @param {object} params
 * @param {object} params.slackRequestParams
 *
 * @class ValidateSlackApiAppId
 */
class ValidateSlackApiAppId {
  /**
   * Constructor to validate slack API app ID.
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.slackRequestParams = params.slackRequestParams;

    oThis.apiAppId = oThis.slackRequestParams.api_app_id;
  }

  /**
   * Perform slack api app ID validation specific operations.
   *
   * @returns {Promise<result|never>}
   * @private
   */
  async perform() {
    const oThis = this;

    try {
      if (CommonValidators.isVarNullOrUndefined(oThis.apiAppId)) {
        throw new Error(`Invalid  apiAppId :: ${oThis.apiAppId}`);
      }

      const appConfig = slackAppConstants.getAppConfigById(oThis.apiAppId);

      if (!CommonValidators.validateNonEmptyObject(appConfig)) {
        throw new Error(`Invalid  apiAppId :: ${oThis.apiAppId}`);
      }
    } catch (error) {
      console.error('Slack authentication failed. Invalid Api App Id');

      return responseHelper.error({
        internal_error_identifier: 'm_a_aai_p',
        api_error_identifier: 'unauthorized_api_request',
        debug_options: { slackRequestParams: oThis.slackRequestParams, apiAppId: oThis.apiAppId }
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

module.exports = ValidateSlackApiAppId;

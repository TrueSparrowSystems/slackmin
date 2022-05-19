const rootPrefix = '../..',
  SlackAuthenticationBase = require(rootPrefix + '/middlewares/authentication/Base'),
  CommonValidators = require(rootPrefix + '/lib/validator/Common');

/**
 * Class to validate slack API app ID.
 *
 * @class ValidateSlackApiAppId
 */
class ValidateSlackApiAppId extends SlackAuthenticationBase {
  /**
   * Constructor to validate slack API app ID.
   *
   * @param {object} params
   * @param {string} params.rawBody
   * @param {object} params.requestHeaders
   * @param {object} params.slackRequestParams
   * @param {string} params.slackRequestParams.api_app_id
   *
   * @augments SlackAuthenticationBase
   *
   * @constructor
   */
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.apiAppId = oThis.slackRequestParams.api_app_id;

    console.log('API App ID: ', oThis.apiAppId);
  }

  /**
   * Perform slack api app ID validation specific operations.
   *
   * @returns {Promise<result|never>}
   * @private
   */
  async _performSpecificValidations() {
    const oThis = this;

    return oThis._validateSlackApiAppId();
  }

  /**
   * Validate slack API app ID.
   *
   * @returns {Promise<never|result>}
   * @private
   */
  async _validateSlackApiAppId() {
    const oThis = this;

    if (CommonValidators.isVarNullOrUndefined(oThis.apiAppId)) {
      throw new Error(`Invalid  apiAppId :: ${oThis.apiAppId}`);
    }

    console.log("_validateSlackApiAppId : ",oThis.apiAppId);
  }
}

module.exports = ValidateSlackApiAppId;

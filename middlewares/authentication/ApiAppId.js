const rootPrefix = '../..',
  SlackAuthenticationBase = require(rootPrefix + '/middlewares/authentication/Base'),
  slackAppConstants = require(rootPrefix + '/lib/constants/slackApp'),
  CommonValidators = require(rootPrefix + '/lib/validator/Common');

/**
 * Class to validate slack API app ID.
 *
 * @class ValidateSlackApiAppId
 *
 * @param {object} params
 * @param {string} params.rawBody
 * @param {object} params.requestHeaders
 * @param {object} params.slackRequestParams
 * @param {string} params.slackRequestParams.api_app_id
 *
 * @augments SlackAuthenticationBase
 */
class ValidateSlackApiAppId extends SlackAuthenticationBase {
  /**
   * Constructor to validate slack API app ID.
   *
   * @constructor
   */
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.apiAppId = oThis.slackRequestParams.api_app_id;
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

    const appConfig = slackAppConstants.getAppConfigById(oThis.apiAppId);

    if (!CommonValidators.validateNonEmptyObject(appConfig)) {
      throw new Error(`Invalid  apiAppId :: ${oThis.apiAppId}`);
    }
  }
}

module.exports = ValidateSlackApiAppId;

const rootPrefix = '../..',
  SlackAuthenticationBase = require(rootPrefix + '/middlewares/authentication/Base'),
  configProvider = require(rootPrefix + '/lib/configProvider'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper');

/**
 * Class to validate slack user.
 *
 * @class ValidateSlackUser
 */
class ValidateSlackUser extends SlackAuthenticationBase {
  /**
   * Constructor to validate slack user.
   *
   * @param {object} params
   * @param {string} params.rawBody
   * @param {object} params.requestHeaders
   * @param {object} params.slackRequestParams
   * @param {string} params.slackRequestParams.slack_id
   *
   * @augments SlackAuthenticationBase
   *
   * @constructor
   */
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.slackId = oThis.slackRequestParams.slack_id;

    console.log('Slack ID: ', oThis.slackId);

    oThis.adminData = {};
  }

  /**
   * Perform slack user validation specific operations.
   *
   * @returns {Promise<result>}
   * @private
   */
  async _performSpecificValidations() {
    const oThis = this;

    return oThis._validateSlackUser();
  }

  /**
   * Prepare response.
   *
   * @returns {result}
   * @private
   */
  _prepareResponse() {
    const oThis = this;

    return responseHelper.successWithData({});
  }

  /**
   * Validate slack user.
   *
   * @sets oThis.adminData
   *
   * @returns {Promise<never|result>}
   * @private
   */
  async _validateSlackUser() {
    const oThis = this;

    const whiteListedUser = configProvider.getFor('whitelisted_users');

    if (!whiteListedUser.includes(oThis.slackId)) {
      throw new Error(`Invalid  SlackId :: ${oThis.slackId}`);
    }
  }
}

module.exports = ValidateSlackUser;

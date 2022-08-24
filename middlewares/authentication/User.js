const rootPrefix = '../..',
  configProvider = require(rootPrefix + '/lib/configProvider'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper');

/**
 * Class to validate slack user.
 *
 * @class ValidateSlackUser
 *
 * @param {object} params
 * @param {object} params.slackRequestParams
 * @param {string} params.slackRequestParams.slack_id
 *
 * @class ValidateSlackUser
 */
class ValidateSlackUser {
  /**
   * Constructor to validate slack user.
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.slackRequestParams = params.slackRequestParams;

    oThis.slackId = oThis.slackRequestParams.slack_id;

    oThis.adminData = {};
  }

  /**
   * Perform slack user validation.
   *
   * @returns {Promise<result>}
   * @private
   */
  async perform() {
    const oThis = this;

    const whiteListedUser = configProvider.getFor('whitelisted_users');

    if (whiteListedUser.length === 0) {
      return oThis._prepareResponse();
    }

    if (!whiteListedUser.includes(oThis.slackId)) {
      console.error(`Invalid  SlackId :: ${oThis.slackId}`);

      return responseHelper.error({
        internal_error_identifier: 'm_a_u_p',
        api_error_identifier: 'unauthorized_api_request',
        debug_options: { slackRequestParams: oThis.slackRequestParams, slackId: oThis.slackId }
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
    const oThis = this;

    return responseHelper.successWithData({});
  }
}

module.exports = ValidateSlackUser;

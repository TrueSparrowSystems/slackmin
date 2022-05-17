const rootPrefix = '../../..',
  CommonValidators = require(rootPrefix + '/lib/validators/Common'),
  SlackAuthenticationBase = require(rootPrefix + '/lib/authentication/slack/Base'),
  AdminDetailsByIdsCache = require(rootPrefix + '/lib/cacheManagement/multi/admin/AdminDetailsByIds'),
  AdminIdsBySlackIdsCache = require(rootPrefix + '/lib/cacheManagement/multi/admin/AdminIdsBySlackIds'),
  logger = require(rootPrefix + '/lib/logger/customConsoleLogger'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

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

    logger.log('Slack ID: ', oThis.slackId);

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

    return responseHelper.successWithData({ current_admin: oThis.adminData });
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

    // Todo:: @Shraddha slack-admin-development implement this
  }
}

module.exports = ValidateSlackUser;

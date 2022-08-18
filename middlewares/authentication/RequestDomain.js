const rootPrefix = '../..',
  CommonValidators = require(rootPrefix + '/lib/validator/Common'),
  configProvider = require(rootPrefix + '/lib/configProvider'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper');

/**
 * Class for validating slack request domain
 *
 * @class ValidateSlackRequestDomain
 */
class ValidateSlackRequestDomain {
  /**
   * Constructor for  class to validate raw body params from slack request.
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

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
      if (!CommonValidators.validateNonEmptyObject(oThis.slackRequestParams)) {
        throw new Error(`Invalid slack request params :: ${oThis.slackRequestParams}`);
      }

      let domain;
      if (oThis.requestPayload) {
        domain = oThis.requestPayload.team.domain;
      } else {
        domain = oThis.slackRequestParams.team_domain;
      }

      let isValidSlackDomain = 0;

      const appConfig = configProvider.getFor('app_config');
      for (let index = 0; index < appConfig.length; index++) {
        if (appConfig[index].slack_domain === domain) {
          isValidSlackDomain = 1;
          break;
        }
      }
      if (!isValidSlackDomain) {
        throw new Error(`Invalid slack request domain :: ${oThis.slackRequestParams}`);
      }
    } catch (error) {
      console.error('Slack authentication failed. Invalid slack domain');

      return responseHelper.error({
        internal_error_identifier: 'm_a_rd_p',
        api_error_identifier: 'unauthorized_api_request',
        debug_options: { slackRequestParams: oThis.slackRequestParams }
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

module.exports = ValidateSlackRequestDomain;

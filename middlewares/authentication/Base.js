const rootPrefix = '../..',
  CommonValidators = require(rootPrefix + '/lib/validator/Common'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper'),
  configProvider = require(rootPrefix + '/lib/configProvider');

/**
 * Base class to validate requests from slack.
 *
 * @class SlackAuthenticationBase
 *
 * @param {object} params
 * @param {string} params.rawBody
 * @param {object} params.requestHeaders
 * @param {object} params.slackRequestParams
 *
 */
class SlackAuthenticationBase {
  /**
   * Constructor for base class to validate requests from slack.
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.rawBody = params.rawBody;
    oThis.requestHeaders = params.requestHeaders;
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
      await oThis._validateRawBodyParams();

      await oThis._validateRequestParams();

      await oThis._validateRequestHeaders();

      await oThis._performSpecificValidations();
    } catch (error) {
      console.error('Slack authentication failed.');

      return responseHelper.error({
        internal_error_identifier: 'l_a_sr_p_1',
        api_error_identifier: 'unauthorized_api_request',
        debug_options: { body: oThis.rawBody, headers: oThis.requestHeaders }
      });
    }

    return oThis._prepareResponse();
  }

  /**
   * Validate raw body params.
   *
   * @return {Promise<*>}
   * @private
   */
  async _validateRawBodyParams() {
    const oThis = this;

    if (!CommonValidators.validateString(oThis.rawBody)) {
      throw new Error(`Invalid raw Body Input :: ${oThis.rawBody}`);
    }
  }

  /**
   * Validate request params.
   *
   * @returns {Promise<never|result>}
   * @private
   */
  async _validateRequestParams() {
    const oThis = this;

    if (!CommonValidators.validateNonEmptyObject(oThis.slackRequestParams)) {
      throw new Error(`Invalid slack request params :: ${oThis.slackRequestParams}`);
    }

    let domain;
    if (oThis.requestPayload) {
      domain = oThis.requestPayload.team.domain;
    } else {
      domain = oThis.slackRequestParams.team_domain;
    }

    const isValidSlackDomain = domain === configProvider.getFor('domain');

    if (!isValidSlackDomain) {
      throw new Error(`Invalid slack request params :: ${oThis.slackRequestParams}`);
    }
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

    await oThis._validateRequestTimestamp();
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
   * Perform class specific validations here.
   *
   * @returns {Promise<void>}
   * @private
   */
  async _performSpecificValidations() {
    throw new Error('Sub-class to implement');
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

module.exports = SlackAuthenticationBase;

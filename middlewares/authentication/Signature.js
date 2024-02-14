const crypto = require('crypto');

const rootPrefix = '../..',
  CommonValidators = require(rootPrefix + '/lib/validator/Common'),
  slackAppConstants = require(rootPrefix + '/lib/constants/slackApp'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper');

/**
 * Class to validate signature request from slack.
 *
 * @class ValidateSlackSignature
 */
class ValidateSlackSignature {
  /**
   * Constructor for ValidateSlackSignature class to validate requests from slack.
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    console.log('type of params.requestBody: ------- ', typeof params.requestBody);
    const requestBody = params.requestBody
    oThis.requestRawBody = params.requestRawBody;
    oThis.requestHeaders = params.requestHeaders;

    console.log('requestBody.payload: ------- ', requestBody.payload);
    oThis.apiAppId = requestBody.payload.api_app_id;

    console.log('oThis.apiAppId: ------- ', oThis.apiAppId);
  }

  /**
   * Perform slack signature validation.
   *
   * @returns {Promise<result|never>}
   * @private
   */
  async perform() {
    const oThis = this;

    try {
      const oThis = this;

      const requestTimestamp = oThis.requestHeaders['x-slack-request-timestamp'];

      const requestHeaderSignature = oThis.requestHeaders['x-slack-signature'];
      const splitRequestHeaderSignature = requestHeaderSignature.split('='),
        version = splitRequestHeaderSignature[0],
        signature = splitRequestHeaderSignature[1];

      if (version !== 'v0') {
        throw new Error(`Invalid slack api version :: ${version}`);
      }

      if (!CommonValidators.validateString(signature)) {
        throw new Error(`Invalid slack api signature :: ${signature}`);
      }

      await oThis._validateSignature(requestTimestamp, version, signature);
    } catch (error) {
      console.error('Slack authentication failed. Invalid slack signature', error);

      return responseHelper.error({
        internal_error_identifier: 'm_a_s_p',
        api_error_identifier: 'unauthorized_api_request',
        debug_options: {
          rawBody: oThis.requestRawBody,
          headers: oThis.requestHeaders,
        }
      });
    }

    return oThis._prepareResponse();
  }

  /**
   * Validate signature.
   *
   * Verifying requests from Slack: https://api.slack.com/authentication/verifying-requests-from-slack
   * Crypto.timingSafeEqual: https://nodejs.org/docs/latest-v6.x/api/crypto.html#crypto_crypto_timingsafeequal_a_b
   * The signature is created by combining the signing secret with the body of the request using a standard HMAC-SHA256 keyed hash.
   *
   * @param {number} requestTimestamp
   * @param {string} version
   * @param {string} signature
   *
   * @returns {Promise<result>}
   * @private
   */
  async _validateSignature(requestTimestamp, version, signature) {
    const oThis = this;

    console.log('oThis.requestRawBody: ------- ', oThis.requestRawBody);
    const signingSecret = slackAppConstants.getSigningSecretForAppId(oThis.apiAppId);

    console.log('signingSecret: ------- ', signingSecret);

    const signatureString = `${version}:${requestTimestamp}:${oThis.requestRawBody}`;
    const computedSignature = crypto
    .createHmac('sha256', signingSecret)
    .update(signatureString, 'utf8')
    .digest('hex');
    
    console.log('signatureString: ------- ', signatureString);
    console.log('computedSignature: ------- ', computedSignature);
    console.log('signature: ------- ', signature);

    if (!crypto.timingSafeEqual(Buffer.from(signature, 'utf-8'), Buffer.from(computedSignature, 'utf-8'))) {
      console.error(`Invalid signature :: ${signature}`);
      throw new Error(`Invalid signature :: ${signature}`);
    }
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

module.exports = ValidateSlackSignature;

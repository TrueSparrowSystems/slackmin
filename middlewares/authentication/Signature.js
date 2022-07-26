const crypto = require('crypto');

const rootPrefix = '../..',
  CommonValidators = require(rootPrefix + '/lib/validator/Common'),
  SlackAuthenticationBase = require(rootPrefix + '/middlewares/authentication/Base'),
  slackAppConstants = require(rootPrefix + '/lib/constants/slackApp');

/**
 * Class to validate signature request from slack.
 *
 * @class ValidateSlackSignature
 *
 * @augments SlackAuthenticationBase
 */
class ValidateSlackSignature extends SlackAuthenticationBase {
  /**
   * Perform signature validation specific operations.
   *
   * @returns {Promise<result|never>}
   * @private
   */
  async _performSpecificValidations() {
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

    return oThis._validateSignature(requestTimestamp, version, signature);
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

    const appId = oThis.slackRequestParams.api_app_id;
    const signingSecret = slackAppConstants.getSigningSecretForAppId(appId);

    const signatureString = `${version}:${requestTimestamp}:${oThis.rawBody}`;
    const computedSignature = crypto
      .createHmac('sha256', signingSecret)
      .update(signatureString)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature, 'utf-8'), Buffer.from(computedSignature, 'utf-8'))) {
      console.error('Invalid signature');
      throw new Error(`Invalid signature :: ${signature}`);
    }
  }
}

module.exports = ValidateSlackSignature;

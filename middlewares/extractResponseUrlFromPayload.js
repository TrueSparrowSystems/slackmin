/**
 * Class for extract response_url from slack payload
 *
 * @class ExtractResponseUrlFromPayload
 */
class ExtractResponseUrlFromPayload {
  constructor() {}

  /**
   * Extract response_url from interactive routes. This middleware should only be used with interactive routes.
   *
   * @param {object} requestBody
   * @param {object} decodedParams
   * @returns {*}
   */
  extractResponseUrlFromPayload(requestBody, decodedParams) {
    const slackPayload = requestBody.payload;
    decodedParams.response_url = slackPayload.response_url;

    return decodedParams;
  }
}

module.exports = new ExtractResponseUrlFromPayload();

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
   * @returns {string | Object.response_url | Object.body.response_url}
   */
  extractResponseUrlFromPayload(requestBody) {
    const slackPayload = requestBody.payload;

    return slackPayload.response_url;
  }
}

module.exports = new ExtractResponseUrlFromPayload();

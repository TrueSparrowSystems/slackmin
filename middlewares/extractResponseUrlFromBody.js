/**
 * Class for extracting response_url from slash commands.
 *
 * @class ExtractResponseUrlFromBody
 */
class ExtractResponseUrlFromBody {
  constructor() {}

  /**
   * Extract response_url from slash commands. This middleware should only be used with slash commands.
   *
   * @param {object} requestBody
   * @param {object} decodedParams
   * @returns {{decodedParams: *, requestBody: *}}
   */
  extractResponseUrl(requestBody, decodedParams) {
    const slackRequestParams = requestBody;
    decodedParams.response_url = slackRequestParams.response_url;

    return {requestBody, decodedParams}
  }
}

module.exports = new ExtractResponseUrlFromBody();

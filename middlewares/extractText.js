/**
 * Class for extracting and preprocessing text from slash command
 *
 * @class ExtractText
 */
class ExtractTextFromBody {
  constructor() {}

  /**
   * Extract text from slash commands. This middleware should only be used with slash commands.
   *
   * @param {object} requestBody
   * @param {object} decodedParams
   * @returns {{decodedParams: *, requestBody: *}}
   */
  extractText(requestBody, decodedParams) {
    const slackRequestParams = requestBody;
    decodedParams.text = (slackRequestParams.text || '').trim();

    return {requestBody, decodedParams}
  }
}

module.exports = new ExtractTextFromBody();

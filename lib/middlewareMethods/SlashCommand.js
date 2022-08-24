const rootPrefix = '../..',
  authenticator = require(rootPrefix + '/middlewares/authentication/Authenticator'),
  extractTextForSlack = require(rootPrefix + '/middlewares/extractText'),
  extractSlackResponseUrlFromBody = require(rootPrefix + '/middlewares/extractResponseUrlFromBody');

class SlashCommandMiddlewares {
  /**
   * Slash command middleware method.
   *
   * @param requestBody
   * @param requestRawBody
   * @param requestHeaders
   * @param decodedParams
   * @returns {Promise<{decodedParams: *, requestBody: *}>}
   * @constructor
   */
  async SlashCommandMiddlewareMethod(requestBody, requestRawBody, requestHeaders, decodedParams) {
    await authenticator.validateSlackChannel(requestRawBody, requestHeaders, requestBody);

    decodedParams = extractTextForSlack.extractText(requestBody, decodedParams);

    decodedParams = extractSlackResponseUrlFromBody.extractResponseUrl(requestBody, decodedParams);

    return { decodedParams, requestBody };
  }
}

module.exports = new SlashCommandMiddlewares();

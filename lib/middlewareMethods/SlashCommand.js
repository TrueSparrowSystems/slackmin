const rootPrefix = '../..',
  authenticator = require(rootPrefix + '/middlewares/authentication/Authenticator'),
  extractTextForSlack = require(rootPrefix + '/middlewares/extractText'),
  extractSlackResponseUrlFromBody = require(rootPrefix + '/middlewares/extractResponseUrlFromBody');

class SlashCommandMiddlewareMethods {
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
    try {
      await authenticator.validateSlackChannel(requestRawBody, requestHeaders, requestBody);
    } catch {
      throw new Error('Validation of slack channel failed');
    }

    decodedParams = extractTextForSlack.extractText(requestBody, decodedParams);

    decodedParams = extractSlackResponseUrlFromBody.extractResponseUrl(requestBody, decodedParams);

    console.log('SlashCommandMiddlewareMethod :: decodedParams ----- ', JSON.stringify(decodedParams));
    console.log('SlashCommandMiddlewareMethod :: requestBody ----- ', JSON.stringify(requestBody));

    return { decodedParams, requestBody };
  }
}

module.exports = new SlashCommandMiddlewareMethods();

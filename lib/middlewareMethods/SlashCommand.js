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

    const extractedTextResponse = extractTextForSlack.extractText(requestBody, decodedParams);
    console.log('extractedTextResponse==============', JSON.stringify(extractedTextResponse))
    requestBody = extractedTextResponse.requestBody;
    decodedParams = extractedTextResponse.decodedParams;

    const extractedSlackResponseUrlResponse = extractSlackResponseUrlFromBody.extractResponseUrl(requestBody, decodedParams);
    console.log('extractedSlackResponseUrlResponse==============', JSON.stringify(extractedSlackResponseUrlResponse));
    requestBody = extractedSlackResponseUrlResponse.requestBody;
    decodedParams = extractedSlackResponseUrlResponse.decodedParams;

    console.log('SlashCommandMiddlewareMethod :: decodedParams ----- ', JSON.stringify(decodedParams));
    console.log('SlashCommandMiddlewareMethod :: requestBody ----- ', JSON.stringify(requestBody));

    return { decodedParams, requestBody };
  }
}

module.exports = new SlashCommandMiddlewareMethods();

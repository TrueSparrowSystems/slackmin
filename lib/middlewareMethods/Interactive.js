const rootPrefix = '../..',
  sanitizer = require(rootPrefix + '/lib/helpers/sanitizer'),
  ExtractTriggerIdMiddleware = require(rootPrefix + '/middlewares/extractTriggerId'),
  ExtractResponseUrlFromPayloadMiddleware = require(rootPrefix + '/middlewares/extractResponseUrlFromPayload'),
  parseApiParameters = require(rootPrefix + '/middlewares/parseApiParams'),
  authenticator = require(rootPrefix + '/middlewares/authentication/Authenticator');

class InteractiveMiddlewares {
  /**
   * Method for interactive middlewares.
   *
   * @param {object} requestParams
   * @param {object} requestBody
   * @param {object} requestRawBody
   * @param {object} requestHeaders
   * @param {object} decodedParams
   * @param {object} internalDecodedParams
   *
   * @returns {Promise<{internalDecodedParams: *, decodedParams: *, requestParams: *}>}
   * @constructor
   */
  async InteractiveMiddleWareMethod(
    requestParams,
    requestBody,
    requestRawBody,
    requestHeaders,
    decodedParams,
    internalDecodedParams
  ) {
    requestParams = sanitizer.sanitizeDynamicUrlParams(requestParams);

    internalDecodedParams.headers = sanitizer.sanitizeHeaderParams(requestHeaders);

    await authenticator.validateSlackApiAppId(requestRawBody, requestHeaders, requestBody);

    decodedParams = ExtractTriggerIdMiddleware.extractTriggerId(requestBody, decodedParams);

    decodedParams = ExtractResponseUrlFromPayloadMiddleware.extractResponseUrlFromPayload(requestBody, decodedParams);

    const parseResp = await parseApiParameters.parse(requestBody, decodedParams, internalDecodedParams);

    decodedParams = parseResp.decodedParams;
    internalDecodedParams = parseResp.internalDecodedParams;

    return { decodedParams, internalDecodedParams, requestParams };
  }
}

module.exports = new InteractiveMiddlewares();

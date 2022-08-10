const rootPrefix = '../..',
  sanitizer = require(rootPrefix + '/lib/helpers/sanitizer'),
  ExtractTriggerIdMiddleware = require(rootPrefix + '/middlewares/extractTriggerId'),
  ExtractResponseUrlFromPayloadMiddleware = require(rootPrefix + '/middlewares/extractResponseUrlFromPayload'),
  parseApiParameters = require(rootPrefix + '/middlewares/parseApiParams'),
  authenticator = require(rootPrefix + '/middlewares/authentication/Authenticator');

class InteractiveMiddlewareMethods {
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

    decodedParams.trigger_id = ExtractTriggerIdMiddleware.extractTriggerId(requestBody);

    decodedParams.response_url = ExtractResponseUrlFromPayloadMiddleware.extractResponseUrlFromPayload(requestBody);

    const parseResp = await parseApiParameters.parse(requestBody, decodedParams, internalDecodedParams);

    if (parseResp.isFailure()) {
      throw parseResp;
    }

    decodedParams = parseResp.data.decodedParams;
    internalDecodedParams = parseResp.data.internalDecodedParams;

    return { decodedParams, internalDecodedParams, requestParams };
  }
}

module.exports = new InteractiveMiddlewareMethods();

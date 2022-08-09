const rootPrefix = '../..',
  PayloadFormatterMiddleware = require(rootPrefix + '/middlewares/formatPayload'),
  AssignParamsMiddleware = require(rootPrefix + '/middlewares/assignParams'),
  sanitizer = require(rootPrefix + '/lib/helpers/sanitizer'),
  ExtractSlackParamsMiddleware = require(rootPrefix + '/middlewares/extractSlackParams'),
  authenticator = require(rootPrefix + '/middlewares/authentication/Authenticator');

class CommonMiddlewareMethods {
  /**
   * Method for common middlewares.
   *
   * @param requestBody
   * @param requestRawBody
   * @param requestQuery
   * @param requestHeaders
   * @param requestMethod
   * @returns {{requestQuery: *, internalDecodedParams: {}, decodedParams: (*|{}), requestBody: *}}
   */
  async CommonMiddleWareMethod(requestBody, requestRawBody, requestQuery, requestHeaders, requestMethod) {
    // Params - req.body, req.rawBody, req.query, req.headers, req.method
    // Return Values - internalDecodedParams, decodedParams, body, query,

    let internalDecodedParams = {},
      decodedParams = {};
    console.log('CommonMiddleWareMethod start-------------------', JSON.stringify(requestBody));

    let formattedPayload;
    try {
      formattedPayload = PayloadFormatterMiddleware.formatPayload(requestBody);
    } catch {
      console.log('Payload formatting failed');
      throw new Error('Payload formatting failed.');
    }

    requestBody.payload = formattedPayload;

    const sanitisedResponse = sanitizer.sanitizeBodyAndQuery(requestBody, requestQuery);
    requestBody = sanitisedResponse.requestBody;
    requestQuery = sanitisedResponse.requestQuery;

    decodedParams = AssignParamsMiddleware.assignParams(requestMethod, requestBody, requestQuery);

    const slackParamsResponse = ExtractSlackParamsMiddleware.extractSlackParams(requestBody, internalDecodedParams);
    console.log('slackParamsResponse==============', slackParamsResponse);
    requestBody = slackParamsResponse.requestBody;
    internalDecodedParams = slackParamsResponse.internalDecodedParams;

    try {
      await authenticator.validateRawBodyParams(requestRawBody);
      await authenticator.validateRequestHeaders(requestHeaders);
      await authenticator.validateRequestDomain(requestBody);
      await authenticator.validateSlackSignature(requestRawBody, requestHeaders, requestBody);
      await authenticator.validateSlackUser(requestRawBody, requestHeaders, requestBody);
    } catch {
      throw new Error('Validation failed');
    }

    return { decodedParams, internalDecodedParams, requestBody, requestQuery };
  }
}

module.exports = new CommonMiddlewareMethods();

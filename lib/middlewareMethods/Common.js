const rootPrefix = '../..',
  AssignRawBodyMiddleware = require(rootPrefix + '/middlewares/assignRawBody'),
  PayloadFormatterMiddleware = require(rootPrefix + '/middlewares/formatPayload'),
  AssignParamsMiddleware = require(rootPrefix + '/middlewares/assignParams'),
  sanitizer = require(rootPrefix + '/lib/helpers/sanitizer'),
  ExtractSlackParamsMiddleware = require(rootPrefix + '/middlewares/extractSlackParams'),
  authenticator = require(rootPrefix + '/middlewares/authentication/Authenticator');

class CommonMiddlewares {
  /**
   * Method for common middlewares.
   *
   * @param requestBody
   * @param requestQuery
   * @param requestHeaders
   * @param requestMethod
   * @returns {{requestQuery: *, internalDecodedParams: {}, decodedParams: (*|{}), requestBody: *}}
   */
  async CommonMiddleWareMethod(
    requestBody,
    requestRawBody,
    requestQuery,
    requestHeaders,
    requestMethod
  ) {
    let internalDecodedParams = {},
      decodedParams = {};

    // 1. Validate slack signature
    await authenticator.validateSlackSignature(requestBody, requestRawBody, requestHeaders);

    // 2. Payload formatting
    const formattedPayload = PayloadFormatterMiddleware.formatPayload(requestBody);
    console.log('formattedPayload: ', formattedPayload);
    requestBody.payload = formattedPayload;

    // 3. Sanitize body and query
    const sanitizedResponse = sanitizer.sanitizeBodyAndQuery(requestBody, requestQuery);
    requestBody = sanitizedResponse.requestBody;
    requestQuery = sanitizedResponse.requestQuery;

    // 4. Assign request params
    decodedParams = AssignParamsMiddleware.assignParams(requestMethod, requestBody, requestQuery);
    console.log('decodedParams: ', decodedParams);

    // 5. Extract slack params
    const slackParamsResponse = ExtractSlackParamsMiddleware.extractSlackParams(requestBody, internalDecodedParams);
    requestBody = slackParamsResponse.requestBody;
    internalDecodedParams = slackParamsResponse.internalDecodedParams;
    console.log('internalDecodedParams: ', internalDecodedParams);

    // 6. Validate raw body params
    await authenticator.validateRawBodyParams(requestRawBody);

    // 7. Validate request headers
    await authenticator.validateRequestHeaders(requestHeaders);

    // 8. Validate request domain
    await authenticator.validateRequestDomain(requestBody);
    
    // 9. Validate slack user
    await authenticator.validateSlackUser(requestBody);

    return { decodedParams, internalDecodedParams, requestBody, requestQuery };
  }
}

module.exports = new CommonMiddlewares();

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
   * @param requestRawBody
   * @param requestQuery
   * @param requestHeaders
   * @param requestMethod
   * @returns {{requestQuery: *, internalDecodedParams: {}, decodedParams: (*|{}), requestBody: *}}
   */
  async CommonMiddleWareMethod(requestBody, requestRawBody, requestQuery, requestHeaders, requestMethod) {
    let internalDecodedParams = {},
      decodedParams = {};
    console.log('CommonMiddleWareMethod start-------------------', JSON.stringify(requestBody));

    requestRawBody = AssignRawBodyMiddleware.assignRawBody(requestBody);
    console.log('requestRawBody==============', requestRawBody);

    const formattedPayload = PayloadFormatterMiddleware.formatPayload(requestBody);
    requestBody.payload = formattedPayload;

    const sanitisedResponse = sanitizer.sanitizeBodyAndQuery(requestBody, requestQuery);
    requestBody = sanitisedResponse.requestBody;
    requestQuery = sanitisedResponse.requestQuery;

    decodedParams = AssignParamsMiddleware.assignParams(requestMethod, requestBody, requestQuery);

    const slackParamsResponse = ExtractSlackParamsMiddleware.extractSlackParams(requestBody, internalDecodedParams);
    console.log('slackParamsResponse==============', slackParamsResponse);
    requestBody = slackParamsResponse.requestBody;
    internalDecodedParams = slackParamsResponse.internalDecodedParams;

    await authenticator.validateRawBodyParams(requestRawBody);
    await authenticator.validateRequestHeaders(requestHeaders);
    await authenticator.validateRequestDomain(requestBody);
    await authenticator.validateSlackSignature(requestRawBody, requestHeaders, requestBody);
    await authenticator.validateSlackUser(requestRawBody, requestHeaders, requestBody);

    return { decodedParams, internalDecodedParams, requestBody, requestQuery };
  }
}

module.exports = new CommonMiddlewares();

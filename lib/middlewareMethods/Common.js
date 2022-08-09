const rootPrefix = '../..',
  formatPayload = require(rootPrefix + '/middlewares/formatPayload'),
  assignParams = require(rootPrefix + '/middlewares/assignParams'),
  sanitizer = require(rootPrefix + '/lib/helpers/sanitizer'),
  extractSlackParams = require(rootPrefix + '/middlewares/extractSlackParams'),
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

    let formattedPayload;
    try {
      formattedPayload = formatPayload(requestBody);
    } catch {
      throw new Error('Payload formatting failed.');
    }

    requestBody.payload = formattedPayload;

    const sanitisedResponse = sanitizer.sanitizeBodyAndQuery(requestBody, requestQuery);
    requestBody = sanitisedResponse.requestBody;
    requestQuery = sanitisedResponse.requestQuery;

    decodedParams = assignParams(requestMethod, requestBody, requestQuery);

    const slackParamsResponse = extractSlackParams(requestBody, internalDecodedParams);
    console.log('slackParamsResponse==============', slackParamsResponse);
    requestBody = slackParamsResponse.body;
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

const _instance = new CommonMiddlewareMethods();

module.exports = (...args) => {
  _instance.CommonMiddleWareMethod(...args);
};

/**
 * Class for assigning params to req
 * @class AssignParams
 */
class AssignParams {
  constructor() {}

  /**
   * Get request params
   *
   * @param {string} requestMethod
   * @param {object} requestBody
   * @param {object} requestQuery
   * @returns {{}|*}
   * @private
   */
  _getRequestParams(requestMethod, requestBody, requestQuery) {
    if (requestMethod === 'POST') {
      return requestBody;
    } else if (requestMethod === 'GET') {
      return requestQuery;
    }

    return {};
  }

  /**
   * Assign params.
   *
   * @param {string} requestMethod
   * @param {object} requestBody
   * @param {object} requestQuery
   * @returns {{}|*|{}}
   */
  assignParams(requestMethod, requestBody, requestQuery) {
    const oThis = this;

    return oThis._getRequestParams(requestMethod, requestBody, requestQuery) || {};
  }
}

module.exports = new AssignParams();

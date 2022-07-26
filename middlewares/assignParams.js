/**
 * Class for assigning params to req
 * @class AssignParams
 */
class AssignParams {
  constructor() {}

  /**
   * Get request params
   *
   * @param req
   * @returns {{}|*}
   * @private
   */
  _getRequestParams(req) {
    if (req.method === 'POST') {
      return req.body;
    } else if (req.method === 'GET') {
      return req.query;
    }

    return {};
  }

  /**
   * Assign params.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  assignParams(req, res, next) {
    const oThis = this;

    req.decodedParams = oThis._getRequestParams(req) || {};
    req.internalDecodedParams = {};
    next();
  }
}

const _instance = new AssignParams();

module.exports = (...args) => {
  _instance.assignParams(...args);
};

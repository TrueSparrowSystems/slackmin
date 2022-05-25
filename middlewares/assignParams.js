/**
 * Class for assigning params to req
 * @class AssignParams
 */
class AssignParams {
  constructor() {}

  /**
   * Assign params.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  assignParams(req, res, next) {
    // IMPORTANT NOTE: Don't assign parameters before sanitization.
    // And assign it to req.decodedParams
    req.decodedParams = req.decodedParams || {};

    next();
  }
}

const _instance = new AssignParams();

module.exports = (...args) => {
  _instance.assignParams(...args);
};

// Express has qs as it's dependency. No need to add it in package.json
const qs = require('qs');

/**
 * Class for assigning raw body.
 * Note: Use this before sanitization as body will change after it.
 *
 * @class AssignRawBody
 */
class AssignRawBody {
  constructor() {}

  /**
   * Assign raw body
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  assignRawBody(req, res, next) {
    req.rawBody = qs.stringify(req.body, { format: 'RFC1738' });

    next();
  }
}

const _instance = new AssignRawBody();

module.exports = (...args) => {
  _instance.assignRawBody(...args);
};

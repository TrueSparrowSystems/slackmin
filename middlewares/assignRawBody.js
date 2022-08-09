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
    //req.rawBody = qs.stringify(req.body, { format: 'RFC1738' });

    let data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      req.rawBody = data;
      console.log('req.rawBody from assignRawBody============================', req.rawBody);
    });

    console.log('assignRawBody middleware success---------------------');

    next();
  }
}

const _instance = new AssignRawBody();

module.exports = (...args) => {
  _instance.assignRawBody(...args);
};

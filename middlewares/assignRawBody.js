const qs = require('qs');
/**
 * Class for assigning raw body
 * @class AssignRawBody
 */
class AssignRawBody {
  constructor() {}

  /**
   * Assign RawBody.
   *
   * @param {object}
   */
  assignRawBody(requestBody) {
    const oThis = this;
    console.log('Not replacing %20 with +');
    // const requestRawBody = qs.stringify(requestBody).replace(/%20/g, '+');
    return requestBody;
  }
}

module.exports = new AssignRawBody();

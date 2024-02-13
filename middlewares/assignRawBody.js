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
    console.log('before replacing + requestRawBody: ----->', requestBody);

    const requestRawBody = qs.stringify(requestBody).replace(/%20/g, '+');

    console.log('after replacing + requestRawBody: ----->', requestRawBody);
    return requestRawBody;
  }
}

module.exports = new AssignRawBody();

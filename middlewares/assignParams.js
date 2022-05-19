class AssignParams{
  constructor(){}

  /**
   * Get request params
   *
   * @param {object} req
   * @return {*}
   */
   _getRequestParams (req) {
    const oThis = this;
    // IMPORTANT NOTE: Don't assign parameters before sanitization.
    if (req.method === 'POST') {
      return req.body;
    } else if (req.method === 'GET') {
      return req.query;
    }

    return {};
  };

  /**
   * Convert string to JSON.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  assignParams (req, res, next) {
    const oThis = this;

    /**
     * IMPORTANT NOTE:
     * Don't assign parameters before sanitization. Also override any request params, related to signatures
     * And finally assign it to req.decodedParams
     */
    req.decodedParams = Object.assign(oThis._getRequestParams(req), req.decodedParams);

    /**
     * Internal decoded params are for parameters which are not passed in the request from outside.
     * setting it to empty hash.
     */
    req.internalDecodedParams = {};

    console.log("middleware :: assignParams :: ", req.decodedParams);

    next();
  };

}



module.exports = new AssignParams().assignParams;

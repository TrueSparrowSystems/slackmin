class ExtractTriggerId {
  constructor() {}

  /**
   * Extract trigger_id from interactive routes. This middleware should only be used with interactive routes.
   * This middleware will not fetch triggerId for view_submission type interactions.
   *
   * @param {object} requestBody
   * @param {object} decodedParams
   * @returns {*}
   */
  extractTriggerId(requestBody, decodedParams) {
    if (requestBody.payload) {
      decodedParams.trigger_id = requestBody.payload.trigger_id;
    }

    return decodedParams;
  }
}

module.exports = new ExtractTriggerId();

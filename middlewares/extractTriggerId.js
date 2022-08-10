class ExtractTriggerId {
  constructor() {}

  /**
   * Extract trigger_id from interactive routes. This middleware should only be used with interactive routes.
   * This middleware will not fetch triggerId for view_submission type interactions.
   *
   * @param requestBody
   * @returns {string|null}
   */
  extractTriggerId(requestBody) {
    if (requestBody.payload) {
      return requestBody.payload.trigger_id;
    }

    return null;
  }
}

module.exports = new ExtractTriggerId();

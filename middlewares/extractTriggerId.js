class ExtractTriggerId {
  constructor() {}

  /**
   * Extract trigger_id from interactive routes. This middleware should only be used with interactive routes.
   * This middleware will not fetch triggerId for view_submission type interactions.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  extractTriggerId(req, res, next) {
    if (req.body.payload) {
      req.decodedParams.trigger_id = req.body.payload.trigger_id;
    }

    next();
  }
}

const _instance = new ExtractTriggerId();

module.exports = (...args) => {
  _instance.extractTriggerId(...args);
};

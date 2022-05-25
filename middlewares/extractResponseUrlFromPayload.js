/**
 * Class for extract response_url from slack payload
 *
 * @class ExtractResponseUrlFromPayload
 */
class ExtractResponseUrlFromPayload {
  constructor() {}
  /**
   * Extract response_url from interactive routes. This middleware should only be used with interactive routes.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  extractResponseUrlFromPayload(req, res, next) {
    const slackPayload = req.body.payload;
    req.decodedParams.response_url = slackPayload.response_url;

    next();
  }
}

const _instance = new ExtractResponseUrlFromPayload();

module.exports = (...args) => {
  _instance.extractResponseUrlFromPayload(...args);
};

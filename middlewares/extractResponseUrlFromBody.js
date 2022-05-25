/**
 * Class for extracting response_url from slash commands.
 *
 * @class ExtractResponseUrlFromBody
 */
class ExtractResponseUrlFromBody {
  constructor() {}

  /**
   * Extract response_url from slash commands. This middleware should only be used with slash commands.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  extractResponseUrlFromBody(req, res, next) {
    const slackRequestParams = req.body;
    req.decodedParams.response_url = slackRequestParams.response_url;

    next();
  }
}

const _instance = new ExtractResponseUrlFromBody();

module.exports = (...args) => {
  _instance.extractResponseUrlFromBody(...args);
};

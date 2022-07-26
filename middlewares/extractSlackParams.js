/**
 * Class for extract slack params
 *
 * extract slack_id, team_domain and api_app_id from slack request payload in case of interactive endpoints.
 * It extract slack_id, team_domain, channel_id and response_url from request body in case of slash commands.
 *
 * @class ExtractSlackParams
 */
class ExtractSlackParams {
  constructor() {}

  /**
   * Extract slack id and slack token.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  extractSlackParams(req, res, next) {
    const slackRequestParams = req.body;
    if (req.body.payload) {
      // Interactive action related routes.
      req.body.slack_id = slackRequestParams.payload.user.id;
      req.body.team_domain = slackRequestParams.payload.team.domain;
      req.body.api_app_id = slackRequestParams.payload.api_app_id;
    } else {
      // Command routes.
      req.body.slack_id = slackRequestParams.user_id;
      req.body.team_domain = slackRequestParams.team_domain;
      req.body.channel_id = slackRequestParams.channel_id;
      req.body.response_url = slackRequestParams.response_url;
    }

    req.internalDecodedParams.api_app_id = req.body.api_app_id;

    next();
  }
}

const _instance = new ExtractSlackParams();

module.exports = (...args) => {
  _instance.extractSlackParams(...args);
};

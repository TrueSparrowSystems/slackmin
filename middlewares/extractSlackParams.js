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
   * @param {object} requestBody
   * @param {object} internalDecodedParams
   * @returns {{internalDecodedParams: *, requestBody: ({payload}|*)}}
   */
  extractSlackParams(requestBody, internalDecodedParams) {
    const slackRequestParams = requestBody;
    if (requestBody.payload) {
      // Interactive action related routes.
      requestBody.slack_id = slackRequestParams.payload.user.id;
      requestBody.team_domain = slackRequestParams.payload.team.domain;
      requestBody.api_app_id = slackRequestParams.payload.api_app_id;
    } else {
      // Command routes.
      requestBody.slack_id = slackRequestParams.user_id;
      requestBody.team_domain = slackRequestParams.team_domain;
      requestBody.channel_id = slackRequestParams.channel_id;
      requestBody.response_url = slackRequestParams.response_url;
    }

    internalDecodedParams.api_app_id = requestBody.api_app_id;

    console.log('requestBody==============>', JSON.stringify(requestBody));
    console.log('internalDecodedParams==============>', internalDecodedParams);

    return { requestBody, internalDecodedParams };
  }
}

module.exports = new ExtractSlackParams();

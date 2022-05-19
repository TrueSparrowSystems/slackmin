class ExtractSlackParams {
    constructor() { }

    /**
     * Extract slack id and slack token.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     */
    extractSlackParams (req, res, next) {
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

        console.log("middleware :: extractSlackParams :: ", slackRequestParams);
        next();
    };
}

module.exports = new ExtractSlackParams().extractSlackParams;
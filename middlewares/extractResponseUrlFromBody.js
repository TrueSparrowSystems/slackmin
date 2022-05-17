class ExtractResponseUrlFromBody {
    constructor() {}

    /**
     * Extract response_url from slash commands. This middleware should only be used with slash commands.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     */
    extractResponseUrlFromBody (req, res, next) {
        const slackRequestParams = req.body;
        req.decodedParams.response_url = slackRequestParams.response_url;
    
        next();
    };
}

module.exports = new ExtractResponseUrlFromBody().extractResponseUrlFromBody;
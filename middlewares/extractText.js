class ExtractText {
    constructor() {}

    /**
     * Extract text from slash commands. This middleware should only be used with slash commands.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     */
    extractText (req, res, next) {
        const slackRequestParams = req.body;
        req.decodedParams.text = (slackRequestParams.text || '').trim();
    
        next();
    };
}

module.exports = new ExtractText().extractText;
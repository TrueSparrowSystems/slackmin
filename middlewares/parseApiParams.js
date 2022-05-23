const rootPrefix = '..',
  slackConstants = require(rootPrefix + '/lib/constants/slackConstants'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper'),
  ParseViewSubmissionApiParams = require(rootPrefix + '/lib/slack/ParseViewActionsApiParams'),
  ParseBlockActionsApiParams = require(rootPrefix + '/lib/slack/ParseBlockActionsApiParams');

class ParseApiParams {
  constructor() {}

  /**
   * Function to get view submission parameters.
   * This method won't be called in case of slash command routes routes. This will be called only for interactive routes.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {Promise<void>}
   */
  async parse(req, res, next) {
    const payload = req.body.payload;

    let apiParamsResponse;

    // TODO
    if (payload.type === slackConstants.viewSubmissionPayloadType) {
      apiParamsResponse = await new ParseViewSubmissionApiParams({
        payload: req.body.payload
      }).perform();
    } else if (payload.type === slackConstants.blockActionsPayloadType) {
      apiParamsResponse = await new ParseBlockActionsApiParams({
        payload: req.body.payload
      }).perform();
    } else {
      // TODO
      const errorObj = responseHelper.error({
        internal_error_identifier: 'r_a_s_i_gap_1',
        api_error_identifier: 'invalid_params',
        debug_options: { slackPayload: payload }
      });
      // check if errorConfig required
      return responseHelper.renderApiResponse(errorObj, res);
    }

    // check if errorConfig required
    if (apiParamsResponse.isFailure()) {
      return responseHelper.renderApiResponse(apiParamsResponse, res);
    }

    const apiParamsData = apiParamsResponse.data;

    console.log('The apiParamsData data is : ', apiParamsData);

    // Assign apiParams to internalDecodedParams.
    const internalDecodedApiParams = {};
    Object.assign(internalDecodedApiParams, apiParamsData.hiddenParams);
    if (apiParamsData.apiParams) {
      Object.assign(internalDecodedApiParams, apiParamsData.apiParams);
    }

    // eslint-disable-next-line require-atomic-updates
    req.internalDecodedParams.apiName = apiParamsData.action;
    // eslint-disable-next-line require-atomic-updates
    Object.assign(req.decodedParams, internalDecodedApiParams);

    next();
  }
}

const _instance = new ParseApiParams();

module.exports = (...args) => {
  _instance.parse(...args);
};

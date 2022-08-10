const rootPrefix = '..',
  slackConstants = require(rootPrefix + '/lib/constants/slackConstants'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper'),
  ParseViewSubmissionApiParams = require(rootPrefix + '/lib/slack/ParseViewActionsApiParams'),
  ParseBlockActionsApiParams = require(rootPrefix + '/lib/slack/ParseBlockActionsApiParams');

class ParseApiParams {
  constructor() {}

  /**
   * Parse and get block_actions payload when a user interacts with block component.
   * Parse and get view_submission payload when users interact with modal views.
   * This method won't be called in case of slash command routes. This will be called only for interactive routes.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {Promise<void>}
   */
  async parse(requestBody, decodedParams, internalDecodedParams) {
    const payload = requestBody.payload;

    let apiParamsResponse;

    if (payload.type === slackConstants.viewSubmissionPayloadType) {
      apiParamsResponse = await new ParseViewSubmissionApiParams({
        payload: requestBody.payload
      }).perform();
    } else if (payload.type === slackConstants.blockActionsPayloadType) {
      apiParamsResponse = await new ParseBlockActionsApiParams({
        payload: requestBody.payload
      }).perform();
    } else {
      const errorObj = responseHelper.error({
        internal_error_identifier: 'r_a_s_i_gap_1',
        api_error_identifier: 'invalid_params',
        debug_options: { slackPayload: payload }
      });
      // check if errorConfig required
      return errorObj;
    }

    // check if errorConfig required
    if (apiParamsResponse.isFailure()) {
      return apiParamsResponse;
    }

    return apiParamsResponse;

    const apiParamsData = apiParamsResponse.data;

    // Assign apiParams to internalDecodedParams.
    const internalDecodedApiParams = {};
    Object.assign(internalDecodedApiParams, apiParamsData.hiddenParams);
    if (apiParamsData.apiParams) {
      Object.assign(internalDecodedApiParams, apiParamsData.apiParams);
    }

    // eslint-disable-next-line require-atomic-updates
    internalDecodedParams.apiName = apiParamsData.action;
    // eslint-disable-next-line require-atomic-updates
    Object.assign(decodedParams, internalDecodedApiParams);

    return responseHelper.successWithData({ decodedParams, internalDecodedParams });
  }
}

module.exports = new ParseApiParams();

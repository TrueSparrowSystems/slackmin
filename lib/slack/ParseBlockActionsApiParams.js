const rootPrefix = '../..',
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  slackConstants = require(rootPrefix + '/lib/constants/slackConstants');

/**
 * Class to create API params from view submission type API calls.
 *
 * @class ParseBlockActionsApiParams
 */
class ParseBlockActionsApiParams {
  /**
   * Constructor to create API params from view submission type API calls.
   *
   * @param {object} params
   * @param {object} params.payload
   * @param {string} params.payload.type
   * @param {object} params.payload.view
   * @param {string} params.payload.view.private_metadata
   * @param {array<object>} params.payload.view.blocks
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.slackPayload = params.payload;
    oThis.view = oThis.slackPayload.view;

    oThis.privateMetadata = {};
    oThis.params = [];

    oThis.blocksIndexedToParamsArray = [];

    oThis.finalResponse = { action: '', apiParams: {}, hiddenParams: {} };
  }

  /**
   * Main performer for class.
   *
   * @returns {Promise<result>}
   */
  async perform() {
    const oThis = this;

    await oThis._validateAndSanitize();

    await oThis._parsePrivateMetadata();

    oThis._setParamsFromPrivateMetadata();

    oThis._setBlocksIndexedToParamsArray();

    await oThis._setFinalResponse();

    return responseHelper.successWithData(oThis.finalResponse);
  }

  /**
   * Validate and sanitize input data.
   *
   * @returns {Promise<result>}
   * @private
   */
  async _validateAndSanitize() {
    const oThis = this;

    if (oThis.slackPayload.type !== slackConstants.viewSubmissionPayloadType) {
      return oThis.invalidParams('l_s_gvsap_vas_1');
    }
  }

  /**
   * Parse private meta data.
   *
   * @sets oThis.privateMetadata
   *
   * @returns {Promise<result>}
   * @private
   */
  async _parsePrivateMetadata() {
    const oThis = this;

    try {
      oThis.privateMetadata = JSON.parse(oThis.view.private_metadata);
    } catch (error) {
      console.error('Error: ', error);

      return oThis.invalidParams('l_s_gvsap_ppmd_1');
    }
  }

  /**
   * Set params from private metadata.
   *
   * @sets oThis.params, oThis.finalResponse
   *
   * @private
   */
  _setParamsFromPrivateMetadata() {
    const oThis = this;

    if (!oThis.privateMetadata.action || !oThis.privateMetadata.params || !oThis.privateMetadata.hiddenParams) {
      return oThis.invalidParams('l_s_gvsap_spfpm_1');
    }

    oThis.finalResponse.action = oThis.privateMetadata.action;
    oThis.params = oThis.privateMetadata.params;
    oThis.finalResponse.hiddenParams = oThis.privateMetadata.hiddenParams;
  }

  /**
   * Set blocks info indexed to index of parameters in oThis.params array.
   *
   * @sets oThis.blocksIndexedToParamsArray
   *
   * @private
   */
  _setBlocksIndexedToParamsArray() {
    const oThis = this;

    const blocksArray = oThis.view.blocks;

    for (let index = 0; index < blocksArray.length; index++) {
      const block = blocksArray[index];

      if (block.type !== 'input') {
        continue;
      }

      const blockAndActionObject = {
        blockId: block.block_id,
        actionId: block.element.action_id,
        elementType: block.element.type
      };
      oThis.blocksIndexedToParamsArray.push(blockAndActionObject);
    }
  }

  /**
   * Set final response.
   *
   * @returns {Promise<result>}
   * @private
   */
  async _setFinalResponse() {
    const oThis = this;

    if (oThis.params.length !== oThis.blocksIndexedToParamsArray.length) {
      return oThis.invalidParams('l_s_gvsap_sfr_1');
    }

    const stateValues = oThis.view.state.values;

    for (let index = 0; index < oThis.blocksIndexedToParamsArray.length; index++) {
      const blockInfo = oThis.blocksIndexedToParamsArray[index];

      const blockId = blockInfo.blockId;
      const actionId = blockInfo.actionId;
      const elementType = blockInfo.elementType;

      const relevantParameter = oThis.params[index];

      // This handles optional parameters.
      if (!stateValues[blockId]) {
        continue;
      }

      const stateObject = stateValues[blockId][actionId];
      switch (elementType) {
        case 'plain_text_input': {
          oThis.finalResponse.apiParams[relevantParameter] = stateObject.value;
          break;
        }
        case 'radio_buttons': {
          oThis.finalResponse.apiParams[relevantParameter] = stateObject.selected_option.value;
          break;
        }
        default:
        // Do nothing;
      }
    }
  }

  /**
   * Invalid params response.
   *
   * @param {string} code
   *
   * @returns {Promise<result>}
   */
  async invalidParams(code) {
    const oThis = this;

    // TODO discuss
    const errorObj = responseHelper.error({
      internal_error_identifier: code,
      api_error_identifier: 'invalid_params',
      debug_options: { slackPayload: oThis.slackPayload }
    });

    return errorObj;
  }
}

module.exports = ParseBlockActionsApiParams;

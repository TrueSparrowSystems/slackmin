/**
 * Standard response formatter
 *
 * @module lib/formatter/response
 */
const Base = require('@plgworks/base'),
  responseHelper = new Base.responseHelper({
    module_name: 'slackAdmin'
  });

const rootPrefix = '../..',
  httpErrorCodes = require(rootPrefix + '/lib/constants/httpErrorCodes'),
  responseHelperMessage = require(rootPrefix + '/lib/constants/responseHelperMessage');

responseHelper.renderApiResponse = function(result, res, errorConfig) {
  errorConfig = errorConfig || {};

  const formattedResponse = result.toHash(errorConfig);

  let status = result.success ? 200 : result._fetchHttpCode(errorConfig.api_error_config || {});

  if (!result.success) {
    if (formattedResponse.err.msg === responseHelperMessage.parameterInvalidOrMissingMessage) {
      formattedResponse.err.msg = responseHelperMessage.somethingWentWrongMessage;
    }
  }

  if (parseInt(status) !== 200 && httpErrorCodes.allowedHttpErrorCodes[status] !== 1) {
    status = httpErrorCodes.internalServerErrorErrorCode;
  }

  return res.status(status).json(formattedResponse);
};

module.exports = responseHelper;

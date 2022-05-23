/**
 * Class for response helper messages.
 *
 * @class ResponseHelperMessage
 */
class ResponseHelperMessage {
  get parameterInvalidOrMissingMessage() {
    return 'At least one parameter is invalid or missing. See "err.error_data" array for more details.';
  }

  get somethingWentWrongMessage() {
    return 'Something went wrong.';
  }
}

module.exports = new ResponseHelperMessage();

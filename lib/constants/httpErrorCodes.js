/**
 * Class for http error codes constants.
 *
 * @class HttpErrorCodes
 */
class HttpErrorCodes {
  /**
   * Get bad request error code.
   *
   * @returns {number}
   */
  get badRequestErrorCode() {
    return 400;
  }

  /**
   * Get unauthorized error code.
   *
   * @returns {number}
   */
  get unauthorizedErrorCode() {
    return 401;
  }

  /**
   * Get forbidden error code.
   *
   * @returns {number}
   */
  get forbiddenErrorCode() {
    return 403;
  }

  /**
   * Get not found error code.
   *
   * @returns {number}
   */
  get notFoundErrorCode() {
    return 404;
  }

  /**
   * Get already exist error code.
   *
   * @returns {number}
   */
  get alreadyExistErrorCode() {
    return 409;
  }

  /**
   * Get unsupported version error code.
   *
   * @returns {number}
   */
  get unsupportedVersionErrorCode() {
    return 410;
  }

  /**
   * Get unprocessable entity error code.
   *
   * @returns {number}
   */
  get unprocessableEntityErrorCode() {
    return 422;
  }

  /**
   * Get internal server error error code.
   *
   * @returns {number}
   */
  get internalServerErrorErrorCode() {
    return 500;
  }

  /**
   * Get service unavailable error code.
   *
   * @returns {number}
   */
  get serviceUnavailableErrorCode() {
    return 503;
  }

  /**
   * Get allowed http error codes.
   *
   * @returns {object}
   */
  get allowedHttpErrorCodes() {
    const oThis = this;

    return {
      [oThis.badRequestErrorCode]: 1,
      [oThis.unauthorizedErrorCode]: 1,
      [oThis.notFoundErrorCode]: 1,
      [oThis.alreadyExistErrorCode]: 0,
      [oThis.unsupportedVersionErrorCode]: 0,
      [oThis.unprocessableEntityErrorCode]: 0,
      [oThis.internalServerErrorErrorCode]: 1,
      [oThis.forbiddenErrorCode]: 1,
      [oThis.serviceUnavailableErrorCode]: 0
    };
  }
}

module.exports = new HttpErrorCodes();

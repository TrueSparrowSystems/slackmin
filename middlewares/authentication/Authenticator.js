const rootPrefix = '../..',
  ValidateSlackApiAppId = require(rootPrefix + '/middlewares/authentication/ApiAppId'),
  ValidateSlackChannel = require(rootPrefix + '/middlewares/authentication/Channel'),
  ValidateSlackSignature = require(rootPrefix + '/middlewares/authentication/Signature'),
  ValidateSlackUser = require(rootPrefix + '/middlewares/authentication/User');

/**
 * Class for Authenticator.
 *
 * @class
 */
class Authenticator {
  /**
   * Function to validate slack Api app ID.
   * This method won't be called in case of slash command routes routes. This will be called only for interactive routes.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {Promise<void>}
   */
  async validateSlackApiAppId(req, res, next) {
    const authResponse = await new ValidateSlackApiAppId({
      rawBody: req.rawBody,
      requestHeaders: req.headers,
      slackRequestParams: req.body
    }).perform();

    if (authResponse.isFailure()) {
      return res.status(200).json('Something went wrong.');
    }

    next();
  }

  /**
   * Function to validate slack channel.
   * This method won't be called in case of interactive routes. This will be called only for slash commands routes.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {Promise<void>}
   */
  async validateSlackChannel(req, res, next) {
    const authResponse = await new ValidateSlackChannel({
      rawBody: req.rawBody,
      requestHeaders: req.headers,
      slackRequestParams: req.body
    }).perform();

    if (authResponse.isFailure()) {
      return res.status(200).json('Something went wrong.');
    }

    next();
  }

  /**
   * Function to validate slack signature.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {Promise<void>}
   */
  async validateSlackSignature(req, res, next) {
    const authResponse = await new ValidateSlackSignature({
      rawBody: req.rawBody,
      requestHeaders: req.headers,
      slackRequestParams: req.body
    }).perform();

    if (authResponse.isFailure()) {
      return res.status(200).json('Something went wrong.');
    }

    next();
  }

  /**
   * Function to validate slack user.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {Promise<void>}
   */
  async validateSlackUser(req, res, next) {
    const authResponse = await new ValidateSlackUser({
      rawBody: req.rawBody,
      requestHeaders: req.headers,
      slackRequestParams: req.body
    }).perform();

    if (authResponse.isFailure()) {
      return res.status(200).json('Something went wrong.');
    }
    next();
  }
}

module.exports = new Authenticator();

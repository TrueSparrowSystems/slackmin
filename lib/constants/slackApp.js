const rootPrefix = '../..',
  configProvider = require(rootPrefix + '/lib/configProvider'),
  CommonValidators = require(rootPrefix + '/lib/validator/Common');

let _slackAppConfigById = null;

/**
 * Class for slack app constants.
 *
 * @class SlackAppConstants
 */
class SlackAppConstants {
  constructor() {
    const oThis = this;
  }

  getSigningSecretForAppId(appId) {
    const appConfig = _slackAppConfigById[appId];

    if (!appConfig) return '';

    return appConfig.secret;
  }

  getBotTokenForAppId(appId) {
    const appConfig = _slackAppConfigById[appId];

    if (!appConfig) return '';

    return appConfig.slack_bot_user_oauth_token;
  }

  setSlackAppConfigById() {
    const configs = configProvider.getFor('app_config');

    if (!Array.isArray(configs)) {
      throw new Error('Array of Object is required.');
    }

    const globalSlackDomain = configProvider.getFor('domain');
    _slackAppConfigById = {};

    for (let index = 0; index < configs.length; index++) {
      const config = configs[index];
      const slackDomain = config.slack_domain || globalSlackDomain; // Use global slack domain, if not passed at app level.
      if (CommonValidators.isVarNullOrUndefined(slackDomain)) {
        throw new Error('slack domain is required.');
      }

      _slackAppConfigById[config.id] = {
        id: config.id,
        secret: config.secret,
        slack_bot_user_oauth_token: config.slack_bot_user_oauth_token,
        slack_domain: slackDomain
      };
    }
  }

  /**
   * Get app config by id
   * @param appId
   */
  getAppConfigById(appId) {
    const appConfig = _slackAppConfigById[appId];

    return appConfig;
  }

  /**
   * Get app configs mapped by app id
   *
   * @returns {null}
   */
  getAppConfigs() {
    return _slackAppConfigById;
  }
}

module.exports = new SlackAppConstants();

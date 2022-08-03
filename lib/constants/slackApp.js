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

    const slackDomain = configProvider.getFor('domain');
    _slackAppConfigById = {};

    for (let index = 0; index < configs.length; index++) {
      const config = configs[index];
      _slackAppConfigById[config.id] = {
        id: config.id,
        secret: config.secret,
        slack_bot_user_oauth_token: config.slack_bot_user_oauth_token,
        slack_domain: slackDomain || config.slack_domain
      };

      if (CommonValidators.isVarNullOrUndefined(_slackAppConfigById[config.id].slack_domain)) {
        throw new Error('slack domain is required.');
      }
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
   * Get app configs
   *
   * @returns {null}
   */
  getAppConfigs() {
    const appConfigs = _slackAppConfigById;

    return appConfigs;
  }
}

module.exports = new SlackAppConstants();

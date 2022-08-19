// Create a file {appRoot}/slackmin.js with the following code
// This helps in maintaining a singleton instance of Slackmin.
// Replace actual values for <slack_app_id>, <slack_signing_secret>,  <slack_bot_user_oauth_token>, <slack_channel_id>, <slack_domain>, <slack_member_id>

const Slackmin = require('@plgworks/slackmin');
const appConfigs = [
  {
    id: '<slack_app1_id>',
    secret: '<slack_signing_secret_for_app1>',
    slack_bot_user_oauth_token: '<slack_bot_user_oauth_token_for_app1>',
    slack_domain: '<slack_app1_domain>'
  },
  {
    id: '<slack_app2_id>',
    secret: '<slack_signing_secret_for_app2>',
    slack_bot_user_oauth_token: '<slack_bot_user_oauth_token_for_app2>',
    slack_domain: '<slack_app2_domain>'
  }
];

const whiteListedChannels = ['<slack_channel_id_app1>', '<slack_channel_id_app2>'];

// Whitelisted users should come from database as there will be many admins. Following is just for example.
const whitelistedUsers = ['<slack_member_id_for_app1>', '<slack_member_id_for_app2>'];

const slackmin = new Slackmin(appConfigs, whiteListedChannels, whitelistedUsers);
module.exports = slackmin;

const Slackmin = require('@plgworks/slackmin');
const appConfigs = [
  {
    id: process.env.SLACKMIN_APP1_ID,
    secret: process.env.SLACKMIN_APP1_SIGNING_SECRET,
    slack_bot_user_oauth_token: process.env.SLACKMIN_APP1_BOT_TOKEN,
    slack_domain: process.env.SLACKMIN_APP1_SLACK_DOMAIN
  },
  {
    id: process.env.SLACKMIN_APP2_ID,
    secret: process.env.SLACKMIN_APP2_SIGNING_SECRET,
    slack_bot_user_oauth_token: process.env.SLACKMIN_APP2_BOT_TOKEN,
    slack_domain: process.env.SLACKMIN_APP2_SLACK_DOMAIN
  },
  {
    id: process.env.SLACKMIN_APP3_ID,
    secret: process.env.SLACKMIN_APP3_SIGNING_SECRET,
    slack_bot_user_oauth_token: process.env.SLACKMIN_APP3_BOT_TOKEN,
    slack_domain: process.env.SLACKMIN_APP3_SLACK_DOMAIN
  }
];

const whiteListedChannels = [process.env.SLACKMIN_CHANNEL1_ID, process.env.SLACKMIN_CHANNEL2_ID];

// Whitelisted users should come from database as there will be many admins. Following is just for example.
const whitelistedUsers = [process.env.SLACKMIN_WHITELISTED_USER1_ID, process.env.SLACKMIN_WHITELISTED_USER2_ID];

const slackmin = new Slackmin(appConfigs, whiteListedChannels, whitelistedUsers);
module.exports = slackmin;

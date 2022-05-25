# Slackmin
![npm version](https://img.shields.io/npm/v/@plgworks/slackmin.svg?style=flat)

Slackmin helps you in easy integration with slack to use slash commands, interactive endpoints, send alert messages, open modals. One use case is to develop admin functionality over slack.

## Why Slackmin?
- Security features involving signature verification, channel authentication, user authentication, team validation, domain validation 
    are taken care of by the exposed middlewares.
- The view submission parameters are extracted into key value pairs for ease of use.
- Message and Modal wrappers help in easy writing of messages and opening of modals.
- Support of interacting with multiple slack apps comes built-in with this package.

## Installation

```sh
npm install slackmin
```

## Initialize
While using the package, create an object of Slackmin at one place (in a provider) and then use it accross the application.
```
// slack admin provider's config
const Slackmin = require('slackmin');

const slackAdmin = new Slackmin(
  [
    {
      id: '<slack_app_id>',
      secret: '<slack_signing_secret>',
      slack_bot_user_oauth_token: '<slack_bot_user_oauth_token>'
    }
  ],
  { '<channel_id>': '1' }, // whitelisted channels
  '<your_slack_domain>',
  ['<slack_member_id>', '<slack_member_id>', '<slack_member_id>'] // whitelisted admin users
);

module.exports = slackAdmin;
```

For more detailed info on exposed functionalities check [here](https://github.com/PLG-Works/slack-admin/blob/slack-admin-development/INDEX.md)

## slackmin middleware usage

For detailed guide of [middlewares](https://github.com/PLG-Works/slack-admin/blob/slack-admin-development/middlewares/middlewares.md)

```
const {
  formatPayload,
  sanitizeBodyAndQuery,
  assignParams,
  sanitizeDynamicUrlParams,
  sanitizeHeaderParams,
  extractSlackParams,
  validateSignature,
  validateSlackUser,
  validateSlackChannel,
  validateSlackApiAppId,
  extractResponseUrlFromPayload,
  extractText,
  extractResponseUrlFromBody,
  parseApiParameters,
  extractTriggerId
} = slackAdmin.middlewares;

// common middlewares
router.use(
  formatPayload,
  sanitizeBodyAndQuery,
  assignParams,
  extractSlackParams,
  validateSignature,
  validateSlackUser
)

//  interactive-endpoint middlewares
router.post(
  '/interactive-endpoint',
  sanitizeDynamicUrlParams,
  sanitizeHeaderParams,
  validateSlackApiAppId,
  extractTriggerId,
  extractResponseUrlFromPayload,
  parseApiParameters,
  async function(req, res, next) {
    // your business logic
  }
);

// '/' command middlewares
router.use(
  validateSlackChannel,
  extractText,
  extractResponseUrlFromBody
);
```

## Components

### Message Preview
```
const message = new slackAdmin.interactiveElements.Message();
```
- Section
- Actions
- Divider
- Context
- Input 
- Header
### Modal Preview
```
const modal = new slackAdmin.interactiveElements.Modal(appId, text);
```
- Section
- Actions
- Divider
- Context
- Input 
- Header

## Notes
To overcome the limitation of single slack app providing only 25 '/' commands, we can provide multiple slack apps in the config.

## Limitations
- No component for datatable in Slack
- Currently has only Message and Modal preview

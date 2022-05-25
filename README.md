# Slackmin
![npm version](https://img.shields.io/npm/v/@plgworks/slackmin.svg?style=flat)

Slackmin helps you in easy integration with slack to use slash commands, interactive endpoints, send alert messages, open modals. 
One use case is to develop admin functionality over slack.

## Why Slackmin?
- Security features involving signature verification, channel authentication, user authentication, team validation, domain validation 
    are taken care of by the exposed middlewares.
- The view submission parameters are extracted into key value pairs for ease of use.
- Message and Modal wrappers help in easy writing of messages and opening of modals.
- Support of interacting with multiple slack apps comes built-in with this package.
  This overcomes the limitation of maximum number of 25 slash commands supported by a slack app.

## Installation

```sh
npm install slackmin
```

## Initialize
While using the package, create an object of Slackmin at one place (in a provider) and then use it accross the application.
```node.js
// slack admin provider's config
const Slackmin = require('slackmin');

const appConfigs = [
  {
    id: '<slack_app_id>',
    secret: '<slack_signing_secret>',
    slack_bot_user_oauth_token: '<slack_bot_user_oauth_token>'
  }
]

const whiteListedChannels = { '<slack_channel_id>': '1' }

const slackDomain = '<your_slack_domain>'

const whitelistedUsers = ['<slack_member_id>', '<slack_member_id>', '<slack_member_id>']

const slackAdmin = new Slackmin(
  appConfigs,
  whiteListedChannels,
  slackDomain,
  whitelistedUsers
);

module.exports = slackAdmin;
```

### Slackmin Params
**1. appConfigs**


`appConfigs` is an array of app config objects allowing slackmin to support multiple apps. Each app config in an object consisting of id, secret and token.

- id: You need to provide your slack app id here. To create a slack app visit https://api.slack.com/apps.
- secret: After you create your app, you can get signing secret from your app credentials. Slack signs the requests sent to you using this secret. We have provided a method that confirms each request coming from Slack by verifying its unique signature.
- slack_bot_user_oauth_token: Your app's presence is determined by the slack bot. A bot token in your app lets users at-mention it, add it to channels and conversations, and allows you to turn on tabs in your app’s home. It makes it possible for users to interact with your app in Slack. In slackmin slack bot sends the message on the slack channel.

<br>

**2. whiteListedChannels**


`whiteListedChannels` is a channel id map consisting of whitelisted channels to execute the slash commands in. Slash commands will execute only in the whitelisted channels.

<br>

**3. slackDomain**


`slackDomain` is your slack app's workspace domain. It could be a team workspace or individual workspace. 

<br>

**4. whitelistedUsers**

`whitelistedUsers` is an array consisting of whitelisted user ids. User id is your member id on slack. Whitelisted users are channel admins that can execute commands in whitelisted channels.

<br>

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
```

### Common Middlewares
```
// common middlewares
router.use(
  formatPayload,
  sanitizeBodyAndQuery,
  assignParams,
  extractSlackParams,
  validateSignature,
  validateSlackUser
)

// OR 

router.use(
  slackmin.commonMiddlewares
);
```

### Interactive Middlewares
```
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

//OR

router.post(
  '/interactive-endpoint',
  slackAdmin.interactiveEndpointMiddlewares,
  async function(req, res, next) {
    // your business logic
  }
)
```

### Slash Command Middlewares
```
// '/' command middlewares
router.use(
  validateSlackChannel,
  extractText,
  extractResponseUrlFromBody
);

//OR

router.use(
  slackAdmin.slashCommandMiddlewares
)
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

# slackmin

## What is slackmin?
An npm package that is used to integrate with your slack app that does the work of admin. You can perform CRUD operations within slack channel itself without the need for any web interface for admin dashboard.

## Why slackmin?
An easy way to integrate admin operations in your slack app which reduces dev effort of building admin dashboards.

## slackmin installation

```
npm install slackmin
```

## slackmin usage

```
// slack admin provider's config
const Slackmin = require('slackmin');

const slackAdmin = new Slackmin(
  [
    {
      id: '<slack_app_id>',
      secret: '<slack_signing_secret>',
      bot_token: '<slack_bot_user_oauth_token>'
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

//  interactive-endpoint middlewares
router.post(
  '/interactive-endpoint',
  formatPayload,
  sanitizeBodyAndQuery,
  assignParams,
  extractSlackParams,
  validateSignature,
  validateSlackUser,
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
  formatPayload,
  sanitizeBodyAndQuery,
  assignParams,
  extractSlackParams,
  validateSignature,
  validateSlackUser,
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

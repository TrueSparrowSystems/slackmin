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
      secret: '<slack_secret>',
      bot_token: '<slack_token>'
    }
  ],
  { '<channel_id>': '1' }, // whitelisted channels
  '<your_slack_domain>',
  ['<slack_member_id>', '<slack_member_id>', '<slack_member_id>'] // whitelisted admin users
);

module.exports = slackAdmin;
```

## slackmin middleware usage

For detailed guide of middlewares

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
- Section
- Actions
- Divider
- Input 
- Header
### Modal Preview
- Section
- Actions
- Divider
- Input 
- Header

## Notes
To overcome the limitation of single slack app providing only 25 '/' commands, we can provide multiple slack apps in the config.

## Limitations
- No component for datatable in Slack
- Currently has only Message and Modal preview
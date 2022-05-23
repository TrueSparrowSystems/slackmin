# slackmin
npm package

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

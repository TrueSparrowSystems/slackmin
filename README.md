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
While using the package, create an object of Slackmin at one place (in a provider) and then use it across the application.
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

- **id**: You need to provide your slack app id here. To create a slack app visit https://api.slack.com/apps.
- **secret**: After you create your app, you can get signing secret from your app credentials. Slack signs the requests sent to you using this secret. We have provided a method that confirms each request coming from Slack by verifying its unique signature.
- **slack_bot_user_oauth_token**: Your app's presence is determined by the slack bot. A bot token in your app lets users at-mention it, add it to channels and conversations, and allows you to turn on tabs in your app’s home. It makes it possible for users to interact with your app in Slack. In slackmin slack bot sends the message on the slack channel.

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

For more detailed info on exposed functionalities check [here](https://github.com/PLG-Works/slackmin/blob/master/INDEX.md)

## slackmin middleware usage

```javascript
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
### Slackmin Middlewares
**1. formatPayload**

`formatPayload` formats and preprocess the slack payload. Parse and regex replace processed links and user mention in slack payload. A slack payload is a JSON object that is used to define metadata about the message, such as where it should be published etc.
<br>

**2. sanitizeBodyAndQuery**

`sanitizeBodyAndQuery` recursively sanitize request body and request query params.

<br>

**3. assignParams**

`assignParams` assign params to request object, so it can be used in subsequent middlewares.

<br>

**4. sanitizeDynamicUrlParams**

`sanitizeDynamicUrlParams` recursively sanitize dynamic params in URL.

<br>

**5. sanitizeHeaderParams**

`sanitizeHeaderParams` recursively sanitize request headers.

<br>


**6. extractSlackParams**

`extractSlackParams` extract slack_id, team_domain and api_app_id from slack request payload in case of interactive endpoints.
It extract slack_id, team_domain, channel_id and response_url from request body in case of slash commands. 

<br>

**7. validateSignature**

`validateSignature` verify requests from slack by verifying signatures using signing secret.
The signature is created by combining the signing secret with the body of the request using a standard HMAC-SHA256 keyed hash.
                    
<br>

**8. validateSlackUser**

`validateSlackUser`perform slack user authentication. It verify if user is present in `whitelistedUsers`. 

<br>

**9. validateSlackChannel**

`validateSlackChannel`perform slack channel authentication. It validates if channel is listed in  `whiteListedChannels`. 
 
<br>

**10. validateSlackApiAppId**

`validateSlackApiAppId` validate slack app Id. It only allows request from provided apps in `appConfigs`.

<br>

**11. extractResponseUrlFromPayload**

`extractResponseUrlFromPayload` extract response_url from interactive routes. This middleware should only be used with interactive endpoints.

<br>

**12. extractText**

`extractText` extract text from slash command's request body. This middleware should only be used with slash commands.

<br>

**13. extractResponseUrlFromBody**

`extractResponseUrlFromBody` extract response_url from slash command's request body. This middleware should only be used with slash commands

<br>

**14. parseApiParameters**

`parseApiParameters` parse and get block_actions payload when a user interacts with block component.
Parse and get view_submission payload when users interact with modal views. This middleware should only be used with interactive endpoints. 

<br>

**15. extractTriggerId**

`extractTriggerId` extract trigger_id from interactive routes. This middleware should only be used with interactive routes.
 This middleware will not fetch triggerId for view_submission type interactions.
 
<br>

For detailed guide of [middlewares](https://github.com/PLG-Works/slackmin/blob/master/middlewares/middlewares.md)

### Common Middlewares
```javascript
// common middlewares
// This set of middlewares can be used with slash commands as well as with interactive routes.
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
```javascript
//  interactive-endpoint middlewares
// This set of middlewares can be used with interactive routes.

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
```javascript
// '/' command middlewares
// This set of middlewares can be used with Slash commands.

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

## Interactive Components

Slack provides a range of visual components, called Block Kit, that can be used in messages. These blocks can be used to lay out complex information in a way that's easy to digest. Each block is represented in slack APIs as a JSON object. You can include up to 50 blocks in each message, and 100 blocks in modals.
You can find Block Kit reference [here](https://api.slack.com/reference/block-kit/blocks)

### Message Wrapper

slackmin Message wrapper allows us to create and format the message alert interface by enabling addition of various blocks.

```javascript
const message = new slackAdmin.interactiveElements.Message();
```

For example,
<br>
adding a section block

```javascript
message.addSection("I want to add some text here. And it should be *markdown*");
```
[Preview for message.addSection](https://app.slack.com/block-kit-builder/T0394LH7H54#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22I%20want%20to%20add%20some%20text%20here.%20And%20it%20should%20be%20*markdown*%22%7D%7D%5D%7D)


adding divider section
```javascript
message.addDivider()
```
[Preview for message.addDivider](https://app.slack.com/block-kit-builder/T0394LH7H54#%7B%22blocks%22:%5B%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22This%20is%20a%20plain%20text%20section%20block.%22,%22emoji%22:true%7D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22This%20is%20a%20plain%20text%20section%20block.%22,%22emoji%22:true%7D%7D,%7B%22type%22:%22divider%22%7D%5D%7D)

adding button elements
```javascript
message.addButtonElements(
  [
    {
      buttonText: 'Click me 1',
      confirmText: 'You clicked the correct button 1',
      value: '{"action":"actionId-0"}'
    },
    {
      buttonText: 'Click me 2',
      confirmText: 'You clicked the correct button 2',
      value: '{"action":"actionId-1"}'
    }
  ]
)
```
[Preview for message.addButtonElements](https://app.slack.com/block-kit-builder/T0394LH7H54#%7B%22blocks%22:%5B%7B%22type%22:%22actions%22,%22elements%22:%5B%7B%22type%22:%22button%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Click%20Me%201%22%7D,%22value%22:%22click_me_123%22,%22action_id%22:%22actionId-0%22,%22confirm%22:%7B%22title%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Are%20you%20sure?%22%7D,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22You%20clicked%20the%20correct%20button%201%22%7D,%22confirm%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Confirm%22%7D,%22deny%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Cancel%22%7D%7D%7D,%7B%22type%22:%22button%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Click%20Me%202%22%7D,%22value%22:%22click_me_1234%22,%22action_id%22:%22actionId-1%22,%22confirm%22:%7B%22title%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Are%20you%20sure?%22%7D,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22You%20clicked%20the%20correct%20button%202%22%7D,%22confirm%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Confirm%22%7D,%22deny%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Cancel%22%7D%7D%7D%5D%7D%5D%7D)

### Modal Wrapper
slackmin Modal wrapper allows us to add various blocks in a popup.
```javascript
// appId is required to validate signature
// text here is modal's title text
const text = "Input Email"
const modal = new slackAdmin.interactiveElements.Modal(appId, text);
```
For example,
<br>

buttons on modal. we can change the text of the confirm button and cancel button.

```javascript
modal.addSubmitAndCancel("Confirm", "Close");
```

add input text box

```javascript
// takes params labelText(string), multiline(boolean), isOptional(boolean)
modal.addTextbox(
  "Your Email",
  false,
  false
)
```
[Preview for modal](https://app.slack.com/block-kit-builder/T0394LH7H54#%7B%22type%22:%22modal%22,%22title%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Input%20Email%22,%22emoji%22:true%7D,%22submit%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Confirm%22,%22emoji%22:true%7D,%22close%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Close%22,%22emoji%22:true%7D,%22blocks%22:%5B%7B%22type%22:%22input%22,%22element%22:%7B%22type%22:%22plain_text_input%22,%22multiline%22:false%7D,%22label%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Your%20Email%22%7D,%22optional%22:false%7D%5D%7D)


You can check out Interactive Components in detail [here](https://github.com/PLG-Works/slackmin/blob/master/lib/slack/InteractiveComponents.md)

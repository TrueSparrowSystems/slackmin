# Slackmin
![npm version](https://img.shields.io/npm/v/@plgworks/slackmin.svg?style=flat)

Slackmin helps you in easy integration with slack to use [slash commands](https://api.slack.com/interactivity/slash-commands), [interactive components](https://api.slack.com/interactivity/slash-commands), format and send messages, and design and use modals.
One use case is to develop admin functionality over slack.

## Demo

#### **Slash Command**

![Slash Command Demo](https://user-images.githubusercontent.com/30872426/171111658-986a456d-19e1-4cd2-b234-4a9b40710e10.gif)

#### **Interactive Component**

![Interactive Component Demo](https://user-images.githubusercontent.com/30872426/171114279-5d0f90bd-09b0-48cd-b7e1-f385dc4c0bfb.gif)

## Why Slackmin?
- Security features involving [signature verification](https://api.slack.com/authentication/verifying-requests-from-slack), channel id validation, slack member id validation, domain validation are taken care of by the exposed middlewares.
- The [block actions payload](https://api.slack.com/reference/interaction-payloads/block-actions) and [view submission payload](https://api.slack.com/reference/interaction-payloads/views#view_submission) are validated and parsed.
- Message wrapper helps in easy formatting of messages.
- Modal wrapper utilizes [Bolt for Javascript](https://slack.dev/bolt-js/concepts) for [creating modals](https://slack.dev/bolt-js/concepts#creating-modals).
- Support of interacting with multiple slack apps comes built-in with this package. This allows you to overcome the limitation of maximum number of 25 slash commands supported by a slack app.

## Prerequisites
Express.js routing knowledge is required.

## Slack app setup
First, we need to setup slack app as mentioned in [this guide](https://api.slack.com/authentication/basics). Following are the major steps involved:

- Create a slack app. Visit https://api.slack.com/apps.
- Configure request URL for interactive components. Refer [here](https://api.slack.com/interactivity/handling).
- Configure slash commands. Refer [here](https://api.slack.com/interactivity/slash-commands).
- Add scopes chat:write and chat:write:public to the bot token scopes. Then install the app. Refer [here](https://api.slack.com/authentication/token-types).

## Installation

```sh
npm install @plgworks/slackmin
```

## Initialize
While using the package, create a singleton object of Slackmin and then use it across the application.
Example snippet for the Slackmin usage is given below.

```node.js

const Slackmin = require('@plgworks/slackmin');

const appConfigs = [
  {
    id: '<slack_app_id>',
    secret: '<slack_signing_secret>',
    slack_bot_user_oauth_token: '<slack_bot_user_oauth_token>'
  }
];

const whiteListedChannels = ['<slack_channel_id>', '<slack_channel_id>', '<slack_channel_id>'];

const slackDomain = '<your_slack_domain>';

const whitelistedUsers = ['<slack_member_id>', '<slack_member_id>', '<slack_member_id>'];

const slackmin = new Slackmin(
  appConfigs,
  whiteListedChannels,
  slackDomain,
  whitelistedUsers
);

module.exports = slackmin;
```

### Slackmin Initialization Params
**1. appConfigs**


`appConfigs` is an array of app config objects allowing slackmin to support multiple apps. Each app config consists of id, secret and token.

- **id**: You need to provide your slack app id here. Follow the slack app setup given above.
- **secret**: After you create your app, you can get signing secret from your app credentials. Slack signs the requests sent to you using this secret. We have provided a method that confirms each request coming from Slack by verifying its unique signature. Refer [here](https://api.slack.com/authentication/verifying-requests-from-slack).
- **slack_bot_user_oauth_token**: Your app's presence is determined by the slack bot. A bot token in your app lets users at-mention it, add it to channels and conversations, and allows you to turn on tabs in your app’s home. It makes it possible for users to interact with your app in Slack.

<br>

**2. whiteListedChannels**


`whiteListedChannels` is an channel ids array which allows whitelisted users to execute slack commands in the whitelisted channel.

<br>

**3. slackDomain**


`slackDomain` is your slack app's workspace domain. It could be a team workspace or individual workspace. 

<br>

**4. whitelistedUsers**

`whitelistedUsers` is an array consisting of whitelisted slack member ids. Whitelisted users are channel admins who can execute commands in whitelisted channels.

## Slackmin Middleware usage

### Common Middlewares
```javascript
const express = require('express');
const router = express.Router();

// common middlewares
// This set of middlewares can be used with slash commands as well as with interactive routes.
router.use(
  slackmin.commonMiddlewares
);

// OR

const {
  formatPayload,
  sanitizeBodyAndQuery,
  assignParams,
  extractSlackParams,
  validateSignature,
  validateSlackUser
} = slackmin.middlewares;

// NOTE: should be used in the same sequence as given if trying to use individually.
// Should be called before slash commands routes and interactive routes.
router.use(
  formatPayload,
  sanitizeBodyAndQuery,
  assignParams,
  extractSlackParams,
  validateSignature,
  validateSlackUser
);

```

### Interactive Component Middlewares
```javascript
const express = require('express');
const router = express.Router();

//  interactive-endpoint middlewares
// This set of middlewares can be used with interactive routes.
router.post(
  '/interactive-endpoint',
  slackmin.interactiveEndpointMiddlewares,
  async function(req, res, next) {
    // your business logic
  }
)

// OR

const {
  sanitizeDynamicUrlParams,
  sanitizeHeaderParams,
  validateSlackApiAppId,
  extractTriggerId,
  extractResponseUrlFromPayload,
  parseApiParameters
} = slackmin.middlewares;

// NOTE: should be used in the same sequence as given if trying to use individually.
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

```

### Slash Command Middlewares
```javascript
const express = require('express');
const router = express.Router();

// slash ('/') command middlewares
// This set of middlewares can be used with Slash commands.
router.use(
  slackmin.slashCommandMiddlewares
)

//OR

const {
  validateSlackChannel,
  extractText,
  extractResponseUrlFromBody
} = slackmin.middlewares;

// NOTE: should be used in the same sequence as given if trying to use individually.
router.use(
  validateSlackChannel,
  extractText,
  extractResponseUrlFromBody
);
```

### Slackmin Middlewares

Following are the middlewares that are exposed individually from slackmin. If you plan to use all middlewares, please follow the sequence mentioned above.

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
} = slackmin.middlewares;
```

**1. formatPayload**

`formatPayload` formats and preprocesses the slack [block actions payload](https://api.slack.com/reference/interaction-payloads/block-actions) and [view submission payload](https://api.slack.com/reference/interaction-payloads/views#view_submission).
<br>

**2. sanitizeBodyAndQuery**

`sanitizeBodyAndQuery` recursively sanitizes request body and request query params.

<br>

**3. assignParams**

`assignParams` sets `decodedParams` empty which is required in subsequent middlewares.

<br>

**4. sanitizeDynamicUrlParams**

`sanitizeDynamicUrlParams` recursively sanitizes dynamic params in URL.

<br>

**5. sanitizeHeaderParams**

`sanitizeHeaderParams` recursively sanitizes request headers.

<br>


**6. extractSlackParams**

`extractSlackParams` extract [slack params](https://api.slack.com/reference/interaction-payloads/block-actions#examples) from slack request payload in case of interactive endpoints.
It extracts [slack params](https://api.slack.com/interactivity/slash-commands#app_command_handling) from request body in case of slash commands. 

<br>

**7. validateSignature**

`validateSignature` verify requests from slack by verifying signatures using signing secret.
The signature is created by combining the signing secret with the body of the request using a standard HMAC-SHA256 keyed hash.
                    
<br>

**8. validateSlackUser**

`validateSlackUser` performs slack user authentication. It verifies if user is present in `whitelistedUsers`. 

<br>

**9. validateSlackChannel**

`validateSlackChannel` performs slack channel authentication. It validates if channel is listed in `whiteListedChannels`. 
 
<br>

**10. validateSlackApiAppId**

`validateSlackApiAppId` validates slack app id. It only allows request from apps provided in `appConfigs`.

<br>

**11. extractResponseUrlFromPayload**

`extractResponseUrlFromPayload` extracts response_url from interactive routes. This middleware should only be used with interactive endpoints.

<br>

**12. extractText**

`extractText` extract text from slash command's request body. This middleware should only be used with slash commands.

<br>

**13. extractResponseUrlFromBody**

`extractResponseUrlFromBody` extract response_url from slash command's request body. This middleware should only be used with slash commands

<br>

**14. parseApiParameters**

`parseApiParameters` parse and get block_actions payload when a user interacts with block component.
Parse and get view_submission payload when users interact with modal views. This middleware should only be used with interactive components.

<br>

**15. extractTriggerId**

`extractTriggerId` extract trigger_id from interactive routes. This middleware should only be used with interactive routes.
 This middleware will not fetch trigger_id for view_submission type interactions.


## Interactive Components

Slack provides a range of visual components, called Block Kit, that can be used in messages. These blocks can be used to lay out complex information in a way that's easy to digest. Each block is represented in slack APIs as a JSON object. You can include up to 50 blocks in each message, and 100 blocks in modals.
You can find Block Kit reference [here](https://api.slack.com/reference/block-kit/blocks)

### Message Wrapper

slackmin Message wrapper allows us to create and format the message alert interface by enabling addition of various [block elements](https://api.slack.com/reference/block-kit/block-elements).

**Methods**

- `addSection`
  - Parameters: text (string)
  - Description: Adds type `"section"` block with text type `"mrkdwn"`
- `addSectionWithTextFields`
  - Parameters: texts (array of strings)
  - Description: Adds type `"section"` block with array of fields type `"mrkdwn"`
- `addButton`
  - Parameters: labelText (string), buttonText (string), value (string)
  - Description: Adds type `"section"` block with type `"button"`. Comes with an option to add `label`. `value` is a string that is sent along with the [interaction payload](https://api.slack.com/interactivity/handling#payloads).
- `addButtonElements`
  - Parameters: buttonDetails (array of objects with keys - buttonText, value)
  - Description: Adds type `"action"` block with array of button elements. Each button element comes with a confirmation popup.
- `addDivider`
  - Parameters: nil
  - Description: Adds type `"divider"` block. 
- `addCustomHeader`
  - Parameters: nil
  - Description: Adds a divider and a section block
- `sendUsingResponseUrl`
  - Parameters: responseUrl (string), isTemporary (boolean)
  - Description: Method for sending message using [response url](https://api.slack.com/interactivity/handling#message_responses). response_type could be [in_channel or ephemeral](https://api.slack.com/interactivity/handling#publishing_ephemeral_response).
- `sendMessageToChannel`
  - Parameters: postMessageParams (object with keys - channel_id, text)
  - Description: utilizes slack's [Web API method](https://api.slack.com/methods/chat.postMessage) `chat.postMessage` to send message to channel for which the channel id is specified.

```javascript
const message = new slackmin.interactiveElements.Message();
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


#### Message Wrapper Example 

```javascript
const message = new slackmin.interactiveElements.Message();
const userId = 100000,
 userInfo = {
  id: userId,
   name: 'Shraddha',
   username: 'Shraddha',
   email: 's@gmail.com',
   phoneNumber: '9067675645'
 },

 currentAdmin = {
   id: 1,
   name: 'Dj'
 };

const actionText = 'Get *user info* for user ' + userId;
message.addCustomHeader(`*ADMIN:* ${currentAdmin.name} - *ACTION:* ${actionText}`);

const texts = [
  '*User Id*:\n' + userInfo.id,
  '*Name*:\n' + userInfo.name,
  '*Username*:\n' + userInfo.username,
  '*Email*:\n' + userInfo.email,
  '*Phone Number* \n' + userInfo.phoneNumber
 ];

message.addSectionWithTextFields(texts);
const actionButtons = [];

// action in value specifies the next method call to be performed for interactive endpoint i.e call to phoneNumberUpdateModal opens the modal
// hiddenParams are internal params that need to be forwarded
const updatePhoneNumber = {
      buttonText: 'Update Phone',
      confirmText: 'Do you want to update phone number of user: *' + userInfo.name + '*?',
      value:
        '{"action":"phoneNumberUpdateModal","hiddenParams":{"text":"' +
        userInfo.id +
        '", "original_response_url":"' +
        responseUrl +
        '"}}'
    };

actionButtons.push(updatePhoneNumber);
message.addButtonElements(actionButtons);
message.sendUsingResponseUrl(responseUrl);
``` 
<img height="250" alt="Message wrapper usage image" src="https://user-images.githubusercontent.com/72125392/171155785-b0cd3aa1-8f7d-480d-bbab-cac527a5d1d0.png" />

### Modal Wrapper
slackmin Modal wrapper allows us to add various [block elements](https://api.slack.com/reference/block-kit/block-elements) in a popup.

**Methods**

- `addSubmitAndCancel`
  - Parameters: submitText (string), cancelText (string)
  - Description: Allows to change text for the submit and close button in the modal
- `addPlainTextSection`
  - Parameters: text (string)
  - Description: Adds type `"section"` block with text type `"plain_text"`
- `addMarkdownTextContext`
  - Parameters: text (string)
  - Description: Adds type `"context"` block with text type `"mrkdwn"`
- `addDivider`
  - Parameters: nil
  - Description: Adds type `"divider"` block.
- `addTextbox`
  - Parameters: labelText (string), multiline (boolean), isOptional (boolean)
  - Description: Adds type `"input"` block having multiline and required option
- `addCheckBoxes`
  - Parameters: labelText (string), optionsArray (object with keys text, value)
  - Description: Adds type `"input"` block with element type `"checkboxes"`. Comes with an option to add `label`. `text` is the checkbox label text. `value` is a string that specifies the value of the option.
- `addRadioButtons`
  - Parameters: labelText (string), optionsArray (object with keys text, value), initialOption (object)
  - Description: Adds type `"input"` block with element type `"radio_buttons"`. Comes with an option to add `label`. `text` is the radio button label text. `value` is a string that specifies the value of the option. You can set `initial_option` in the element for selecting radio option by default.
- `addParamsMeta`
  - Parameters: paramsMeta (array of string)
  - Description: To specify parameter names for the subsequent textboxes.
- `addHiddenParamsMeta`
  - Parameters: hiddenParamsMeta (object)
  - Description: To pass on internal parameters
- `addAction`
  - Parameters: actionName (string)
  - Description: You can provide the next action method/route to be executed on modal submit.
- `open` 
  - Parameters: triggerId (string)
  - Description: utilizes [Bolt for Javascript](https://slack.dev/bolt-js/concepts#creating-modals) to open modal view. It requires trigger_id obtained from interaction payload. Refer [here](https://api.slack.com/surfaces/modals/using) for more on modals.

```javascript
// appId is required to validate signature
// text here is modal's title text
const text = "Input Email"
const modal = new slackmin.interactiveElements.Modal(appId, text);
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
<br>

#### Modal Wrapper Example

```javascript
const apiAppId = 'A03GGU0AKKK'; // slack_app_id
const modal = new SlackAdminProvider.interactiveElements.Modal(apiAppId, 'Give your vote');

// Mandatory parameters when creating a new modal. Add your next action route here
modal.addAction('submitForm');

// These are the parameter names for the subsequent textboxes.
const paramsMeta = ['name', 'member_id', 'designation', 'projects'];

modal.addParamsMeta(paramsMeta);
modal.addTextbox('Name', false);
modal.addTextbox('Member Id', false);

modal.addRadioButtons(
 'Designation',
  [
    { text: 'Front End Developer', value: 'FE' },
    { text: 'Back End Developer', value: 'BE' },
    { text: 'Quality Assurance Engineer', value: 'QA' }
  ],
  { text: 'Front End Developer', value: 'FE' }
);
  
modal.addCheckBoxes('Projects', [
  { text: 'Fab', value: '1' },
  { text: 'Moxie', value: '2'},
  { text: 'Hem', value: '3' }
]);

modal.addSubmitAndCancel();

return modal.open(triggerId);
```
<img height="500" alt="Modal wrapper usage image" src="https://user-images.githubusercontent.com/72125392/171181904-2175a0a7-bb2d-4155-92ef-b8c3960a3e2f.png" />

# Contributors
[Divyajyoti Ukirde](https://plgworks.com/blog/author/divyajyoti/), [Shraddha Falane](https://plgworks.com/blog/author/shraddha/), [Kedar Chandrayan](https://plgworks.com/blog/author/kedar/), [Parv Saxena](https://plgworks.com/blog/author/parv/)

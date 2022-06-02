# Slackmin
![npm version](https://img.shields.io/npm/v/@plgworks/slackmin.svg?style=flat)

Slackmin helps you in easy integration with slack to use [slash commands](https://api.slack.com/interactivity/slash-commands), [interactive components](https://api.slack.com/interactivity/components), format and send messages, design and use modals. One use case of Slackmin is to implement admin functionality over slack.

## Demo

#### **Slash Command**

![Slash Command Demo](https://user-images.githubusercontent.com/30872426/171111658-986a456d-19e1-4cd2-b234-4a9b40710e10.gif)

#### **Interactive Component**

![Interactive Component Demo](https://user-images.githubusercontent.com/30872426/171114279-5d0f90bd-09b0-48cd-b7e1-f385dc4c0bfb.gif)

## Why Slackmin?
- Slackmin provides Message and Modal wrappers that help in easy writing of messages, sending system alerts and [creating modals](https://slack.dev/bolt-js/concepts#creating-modals).
- Slackmin's multiple slack app support helps in Overcoming the 25 slash commands limitation in slack apps. Also, you can create applications to manage content management systems, user management systems, order management systems, and many more.
- The [block actions payload](https://api.slack.com/reference/interaction-payloads/block-actions) and [view submission payload](https://api.slack.com/reference/interaction-payloads/views#view_submission) are validated and parsed.

Additionally, Slackmin provides following built-in security features:
- **Sanitize unwanted HTML tags** from parameters obtained in request body, query, headers. [HTML sanitization](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#html-sanitization) is recommended by Open Web Application Security Project (OWASP)
- **Signature / signed secret verification** is provided as a middleware ready to be plugged in and used for all the requests coming from slack. This [guide](https://api.slack.com/authentication/verifying-requests-from-slack) gives a detailed description of signature verification.
- **Slack app id** is validated against whitelisted app ids. This validation is also provided via middleware.
- **Slack channel** validation is done to only allow requests from whitelisted slack channels. For example, there can be one admin channel, in which we add all the admins and they can execute slash commands from there. Requests coming from other channels will be outright rejected. This validation is also provided via middleware.
- **User authentication** helps in validating whether the user has admin rights or not. We validate the slack id of the user against whitelisted slack ids. This validation is also provided via middleware.
- Slack app’s **workspace domain** validation is also exposed as a middleware.

Thus Slackmin helps in integrating with slack involving minimum efforts (hence the name, Slackmin).

## Prerequisites
[Express.js routing](https://expressjs.com/en/guide/routing.html) knowledge is required.

## Slack app setup
First, we need to setup a slack app as mentioned in [this guide](https://api.slack.com/authentication/basics). Following are the major steps involved:

- Create a slack app. Visit https://api.slack.com/apps.
- Configure request URL for interactive components. Click [here](https://api.slack.com/interactivity/handling) for details.
- Configure slash commands. For more details [click here](https://api.slack.com/interactivity/slash-commands).
- Add scopes [chat:write](https://api.slack.com/scopes/chat:write) and [chat:write:public](https://api.slack.com/scopes/chat:write.public) to the bot token scopes. Know more about [Slack Scopes](https://api.slack.com/scopes).
- Then [install](https://api.slack.com/authentication/basics#installing) the app to your workspace.

Keep a note of your App ID and Signing Secret from "Basic Information" section of your app. Also note the Bot User OAuth Token from "OAuth & Permissions" section of your app. These will be required in further steps.

## Install NPM

```sh
npm install @plgworks/slackmin --save
```

## Initialize
While using the package, create a singleton object of Slackmin and then use it across the application.
Example snippet for the Slackmin singleton object is given below.

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
**1. `appConfigs`** is an array of app config objects allowing Slackmin to support multiple apps. Each app config consists of id, secret and token.

- **id**: This is your slack app id.
- **secret**: Your app's signing secret. This is used to do request signature verification.
- **slack_bot_user_oauth_token**: This is the Bot User OAuth Token.

<br>

**2. `whiteListedChannels`** is an array of whitelisted channel ids. Only whitelisted users are allowed to execute slash commands in the whitelisted channels.

<br>

**3. `slackDomain`** is your slack app's workspace domain. It could be a team workspace or individual workspace.

<br>

**4. `whitelistedUsers`** is an array of whitelisted slack member ids. Only whitelisted users are allowed to execute slash commands in the whitelisted channels.

## Slackmin Middleware Usage

Slackmin middlewares are used with slash commands as well as with interactive routes. These middlewares format and preprocess the Slack payload, and sanitize unwanted HTML tags from parameters obtained in the request body, query and headers. Slackmin has a built-in security layer for request verification, app id validation, channel id validation, and slack member id validation.

### Interactive Component Middlewares
```javascript
const express = require('express');
const slackmin = require('path-to-your-slackmin-singletone-provider');
const router = express.Router();

// common middlewares
// This set of middlewares can be used with slash commands as well as with interactive routes.
router.use(
  slackmin.commonMiddlewares
);

//  interactive-endpoint middlewares
// This set of middlewares can be used with interactive routes.
router.use(
  slackmin.interactiveEndpointMiddlewares
);

// Example interactive endpoint
router.post(
  '/interactive-endpoint',
  async function(req, res, next) {
     // your business logic
    // req.decodedParams contains sanitized parameters and must be used to read data for further business logic.
   console.log(req.decodedParams);  }
);
```

### Slash Command Middlewares
```javascript
const express = require('express');
const slackmin = require('path-to-your-slackmin-singletone-provider');
const router = express.Router();

// common middlewares
// This set of middlewares can be used with slash commands as well as with interactive routes.
router.use(
  slackmin.commonMiddlewares
);

// slash ('/') command middlewares
// This set of middlewares can be used with Slash commands.
router.use(
  slackmin.slashCommandMiddlewares
);

// Write all routes specific to slash commands below.
// Example slash command endpoint
router.post(
  '/slash-command',
  async function(req, res, next) {
     // your business logic
    // req.decodedParams contains sanitized parameters and must be used to read data for further business logic.
   console.log(req.decodedParams);
  }
);
```
**Important Note**: `req.decodedParams` contains sanitized parameters and must be used to read data for further business logic.


## Interactive Components

Slack provides a range of visual components, called Block Kit, used to layout complex information. Each block is represented in slack APIs as a JSON object. You can include up to 50 blocks in a message and 100 blocks in modals.
You can find the Block Kit reference [here](https://api.slack.com/reference/block-kit/blocks).

### Message Wrapper

Slackmin Message wrapper provides simple methods to create and format complex message layouts thus simplifies the creation of [block elements](https://api.slack.com/reference/block-kit/block-elements).

**Methods**

- `addSection`
  - Parameters: text (string)
  - Description: Adds a [section](https://api.slack.com/reference/block-kit/blocks#section) block with the provided text. Supports [mrkdwn](https://api.slack.com/reference/surfaces/formatting).
- `addSectionWithTextFields`
  - Parameters: texts (array of strings)
  - Description: Adds a [section](https://api.slack.com/reference/block-kit/blocks#section) block with two columns layout to display provided texts. Supports [mrkdwn](https://api.slack.com/reference/surfaces/formatting).
- `addButton`
  - Parameters: labelText (string), buttonText (string), value (string)
  - Description: Adds a [section](https://api.slack.com/reference/block-kit/blocks#section) block to render a [button](https://api.slack.com/reference/block-kit/block-elements#button). 
  `labelText` is the section text, `buttonText` is the button label text and `value` is the button value. 
- `addButtonElements`
  - Parameters: buttonDetails (array of objects with keys - buttonText, value, confirmText)
  - Description: Adds an [action](https://api.slack.com/reference/block-kit/blocks#actions) block with multiple [button](https://api.slack.com/reference/block-kit/block-elements#button) elements.
   Each button element comes with a confirmation popup. `buttonText` is the button label text, `value` is the button value and `confirmText` is the confirmation pop up message. If you don't want to have
   a confirmation pop up, don't pass `confirmText`.
- `addDivider`
  - Parameters: null
  - Description: Adds [divider](https://api.slack.com/reference/block-kit/blocks#divider) block.
- `addCustomHeader`
  - Parameters: text (string)
  - Description: Adds a [divider](https://api.slack.com/reference/block-kit/blocks#divider) and a [section](https://api.slack.com/reference/block-kit/blocks#section) block with the provided text. Supports [mrkdwn](https://api.slack.com/reference/surfaces/formatting).
- `sendUsingResponseUrl`
  - Parameters: responseUrl (string), isTemporary (boolean)
  - Description: Method for sending message using [response url](https://api.slack.com/interactivity/handling#message_responses). `responseUrl` is the response URL. `isTemporary` is true for [ephemeral message] (https://api.slack.com/messaging/managing#ephemeral), otherwise false.
- `sendMessageToChannel`
  - Parameters: postMessageParams (object with keys - channel, text)
  - Description: utilizes slack's [Web API method](https://api.slack.com/methods/chat.postMessage) `chat.postMessage` to send message to channel. `channel` is the channel id. `text` is the message title text.

#### Example

```javascript
const message = new slackmin.interactiveElements.Message();

message.addCustomHeader(`*ADMIN:* John - *ACTION:* Fetched user with id: 123`);

const texts = [
  '*User Id*:\n' + '123',
  '*Name*:\n' + 'David',
  '*Username*:\n' + 'david_qwerty',
  '*Email*:\n' + 'david@example.com',
  '*Phone Number* \n' + '(555) 555-1234'
 ];

message.addSectionWithTextFields(texts);
const actionButtons = [];

// action in value specifies the next method call to be performed for interactive endpoint i.e call to phoneNumberUpdateModal opens the modal
// hiddenParams are internal params that need to be forwarded
const updatePhoneNumberButton = {
      buttonText: 'Update Phone',
      confirmText: 'Do you want to update phone number for the user?',
      value:
        '{"action":"phoneNumberUpdateModal","hiddenParams":{"user_id":"123", "original_response_url":"' +
        responseUrl +
        '"}}'
    };

actionButtons.push(updatePhoneNumberButton);
message.addButtonElements(actionButtons);
message.sendUsingResponseUrl(responseUrl);
```
Output of above code will look like below:

<img height="250" alt="Message wrapper usage image" src="https://user-images.githubusercontent.com/72125392/171155785-b0cd3aa1-8f7d-480d-bbab-cac527a5d1d0.png" />

### Modal Wrapper
Slackmin Modal wrapper allows us to add various [block elements](https://api.slack.com/reference/block-kit/block-elements) in a popup. Following are different methods available in wrapper
which can be used to create [modal](https://api.slack.com/surfaces/modals).

**Methods**

- `addSubmitAndCancel`
  - Parameters: submitText (string), cancelText (string)
  - Description: Add submit and cancel [button]((https://api.slack.com/reference/block-kit/block-elements#button)) elements in [modal](https://api.slack.com/surfaces/modals).
  `submitText` is the submit button label text. `cancelText` is the cancel button label text.
- `addPlainTextSection`
  - Parameters: text (string)
  - Description: Adds a [section](https://api.slack.com/reference/block-kit/blocks#section) block with the provided text.
- `addMarkdownTextContext`
  - Parameters: text (string)
  - Description: Adds a [context](https://api.slack.com/reference/block-kit/blocks#context) block with the provided text. Supports [mrkdwn](https://api.slack.com/reference/surfaces/formatting).
- `addDivider`
  - Parameters: null
  - Description: Adds [divider](https://api.slack.com/reference/block-kit/blocks#divider) block.
- `addTextbox`
  - Parameters: labelText (string), multiline (boolean), isOptional (boolean)
  - Description: Adds a [input](https://api.slack.com/reference/block-kit/blocks#input) block with an element type [plain-text](https://api.slack.com/reference/block-kit/block-elements#input).
  `labelText` is the input block label text. `multiline` indicates whether the input will be a single line (false) or a larger textarea (true), defaults set to true.
  `isOptional` is a boolean that indicates whether the input element may be empty when a user submits the modal, defaults set to false.
- `addCheckBoxes`
  - Parameters: labelText (string), optionsArray (object with keys text, value)
  - Description: Adds a [input](https://api.slack.com/reference/block-kit/blocks#input) block with an element type [checkboxes](https://api.slack.com/reference/block-kit/block-elements#checkboxes). 
    `labelText` is the input block label text. `text` is the checkbox label text. `value` is a unique string that specifies the value of the option.
- `addRadioButtons`
  - Parameters: labelText (string), optionsArray (object with keys text, value), initialOption (object)
  - Description: Adds a [input](https://api.slack.com/reference/block-kit/blocks#input) block with an element type [radio buttons](https://api.slack.com/reference/block-kit/block-elements#radio). 
   `labelText` is the input block label text. `text` is the radio button label text. `value` is a unique string value that will be passed to your app when any option is chosen. You can set `initial_option` in the element for selecting radio button option by default.
- `addParamsMeta`
  - Parameters: paramsMeta (array of string)
  - Description: To specify parameter names for the subsequent [input](https://api.slack.com/reference/block-kit/blocks#input) block elements such as [plain-text](https://api.slack.com/reference/block-kit/block-elements#input),
    [checkboxes](https://api.slack.com/reference/block-kit/block-elements#checkboxes) and [radio buttons](https://api.slack.com/reference/block-kit/block-elements#radio).
- `addHiddenParamsMeta`
  - Parameters: hiddenParamsMeta (object)
  - Description: To pass on internal parameters on modal submit. `hiddenParamsMeta` contains hidden parameters which has to pass for next modal action.
- `addAction`
  - Parameters: actionName (string)
  - Description: You can provide the next action method/route to be executed on modal submit. 
- `open`
  - Parameters: triggerId (string)
  - Description: utilizes [Bolt for Javascript](https://slack.dev/bolt-js/concepts#creating-modals) to open modal view. `triggerId` is obtained from [interaction payload](https://api.slack.com/interactivity/handling#payloads).
#### Modal Wrapper Example

```javascript
const apiAppId = 'A03GGU0AKKK'; // slack_app_id
const modal = new slackmin.interactiveElements.Modal(apiAppId, 'Give your vote');

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
Output of above code will look like below:

<img height="500" alt="Modal wrapper usage image" src="https://user-images.githubusercontent.com/72125392/171181904-2175a0a7-bb2d-4155-92ef-b8c3960a3e2f.png" />

#### Hidden Parameters in Modals

 When we are interacting with different entities in slack through the modal box, parameters like entity, user_id on which we are performing CURD operations need to pass in modal.
 Thus, we are passing parameters as hidden parameters on button action in below example:

```javascript
const name = 'abc'; // mention user name
let userId, responseUrl;  // add your user id and responseUrl

// action in value specifies the next method call to be performed for interactive endpoint i.e call to updateEmailModal opens the modal
// hiddenParams are internal params that need to be forwarded on button action to perform necessary CURD operations on entity
const button = {
  buttonText: 'Upate User Email',
  confirmText: 'Do you want to update email of user name: ' + name + '?',
  value: '{"action":"updateEmailModal","hiddenParams":{"user_id":"' +
            userId +
            '", "original_response_url":"' +
            responseUrl +
            '"}}'
  };

```

 Further, our Interctive Component Middleware layer extracts hidden parameters from block_actions payload's view object and similarly from view_submission payload's view object. 
 Extracted hidden parameters are assigned in `req.decodedParams`.
 
# Conclusion

Slackmin package can be effectively used to build an admin functionality over slack with security features by using exposed middlewares. 
Message wrapper and modal wrapper methods can be easily used to message formatting and modal creation. 

# Contributors
[Divyajyoti Ukirde](https://plgworks.com/blog/author/divyajyoti/), [Shraddha Falane](https://plgworks.com/blog/author/shraddha/), [Kedar Chandrayan](https://plgworks.com/blog/author/kedar/), [Parv Saxena](https://plgworks.com/blog/author/parv/)

# Slackmin
![npm version](https://img.shields.io/npm/v/@plgworks/slackmin.svg?style=flat)

Slackmin helps you in easy integration with slack to use [slash commands](https://api.slack.com/interactivity/slash-commands), [interactive components](https://api.slack.com/interactivity/components), format and send messages, design and use modals. One use case of Slackmin is to implement admin functionality over slack.

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

## Demo
Let's first see a quick demo of the functionality which can be easily implemented using Slackmin.

### Slash Command
In the following, you can see a working slash command which is used to fetch user info from the server.

![Slash Command Demo](https://user-images.githubusercontent.com/72125392/171839968-648fea39-eb6e-43f6-a384-da79b518754d.gif)

### Open Modal
Along with the user information which is fetch by the above slash command, the message also has a button for "Update Phone".
In the following demo, we can see that a confirmation popup comes on pressing the button. When we confirm, a modal with input for the new phone number opens.
User enters the new phone numner and submits the modal. After the updation, a success message is sent.

![Interactive Component Demo](https://user-images.githubusercontent.com/72125392/171840413-ed5fef75-5ae3-4df6-9345-d79e9a7beec3.gif)

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

### Initialization Params
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

## Middlewares

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
  - Description: Utilizes slack's [Web API method](https://api.slack.com/methods/chat.postMessage) `chat.postMessage` to send message to channel. `channel` is the channel id. `text` is the message title text.

#### Example 1 - Async Message
When responding to a slash command or any other interaction, we have 2 choices - synchronous manner and asynchronous manner. In the following example, we are responding in asynchronous manner.
In asynchronous manner, we have to use the [response url](https://api.slack.com/interactivity/handling#message_responses) on which the message can be sent within 30 minutes of interaction.

```javascript
const responseUrl = 'Response URL HERE';
const message = new slackmin.interactiveElements.Message();

message.addCustomHeader('Message *title* `text` here.');

const texts = [
  '2 Column Support.',
  '`mrkdwn` is supported too.',
  'Row 2, Column 1.',
  'Row 2, Column 2.'
 ];

message.addSectionWithTextFields(texts);
const actionButtons = [];

// as a convention, we have value as a JSON string with keys action and hiddenParams.
// action specifies the next method call to be performed for interactive endpoint i.e call to testModal1Open opens the test modal 1
// hiddenParams in value are internal params that need to be forwarded
const testButton1 = {
      buttonText: 'Test Button 1',
      confirmText: 'Do you want to really click the test button 1?',
      value:
        "{\"action\":\"testModal1Open\",\"hiddenParams\":{\"user_id\":\"123\"}}"
    };

actionButtons.push(testButton1);

const testButton2 = {
      buttonText: 'Test Button 2',
      confirmText: 'Do you want to really click the test button 2?',
      value:
        "{\"action\":\"testModal2Open\",\"hiddenParams\":{\"user_id\":\"123\"}}"
    };

actionButtons.push(testButton2);

message.addButtonElements(actionButtons);
message.sendUsingResponseUrl(responseUrl);
```
Output of above code is shown in the screenshot below. On clicking of the buttons a confirmation popup comes, as configured.

<img width="636" alt="Message wrapper async example" src="https://user-images.githubusercontent.com/7627517/171792168-df189989-0790-4326-b54a-1ff79b0c6c1f.png">

#### Example 2 - Sync Message / System Alert
If the generation of the message body is simple, then it can be done in a synchronous manner. Following is an example of the same.

```javascript
const text = 'TITLE TEXT';

const slackMessageParams = {};
slackMessageParams.text = text;
slackMessageParams.channel = 'CHANNEL ID HERE';

const message = new slackmin.interactiveElements.Message();
message.addDivider();
message.addSection(`*${text}*`);
message.addSection('Another section.');

message.sendMessageToChannel(slackMessageParams);
```
Output of above code is shown in the screenshot below.

<img width="473" alt="Sync Message / System Alert" src="https://user-images.githubusercontent.com/7627517/171800304-5b3ddd5c-0deb-4a71-828d-a2259fe2e985.png">

### Modal Wrapper
Slackmin Modal wrapper provides simple methods to create and format complex [modal](https://api.slack.com/surfaces/modals) layouts thus simplifies the creation of [block elements](https://api.slack.com/reference/block-kit/block-elements).

**Methods**

- `addSubmitAndCancel`
  - Parameters: submitText (string), cancelText (string)
  - Description: Add submit and cancel button to the modal. `submitText` is the submit button label text. `cancelText` is the cancel button label text.
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
  - Parameters: labelText (string), optionsArray (Array of objects, each object with keys text, value)
  - Description: Adds a [input](https://api.slack.com/reference/block-kit/blocks#input) block with an element type [checkboxes](https://api.slack.com/reference/block-kit/block-elements#checkboxes). 
    `labelText` is the input block label text. `text` is the individual checkbox option label text. `value` is a unique string that specifies the value of the checkbox option.
- `addRadioButtons`
  - Parameters: labelText (string), optionsArray (Array of objects, each object with keys text, value), initialOption (object with keys text and value)
  - Description: Adds a [input](https://api.slack.com/reference/block-kit/blocks#input) block with an element type [radio buttons](https://api.slack.com/reference/block-kit/block-elements#radio). 
   `labelText` is the input block label text. `text` is the radio button label text. `value` is a unique string value that will be passed to your app when any option is chosen. You can set `initial_option` in the element for selecting radio button option by default.
- `addParamsMeta`
  - Parameters: paramsMeta (array of strings)
  - Description: To specify parameter names for the subsequent [input](https://api.slack.com/reference/block-kit/blocks#input) block elements such as [plain-text](https://api.slack.com/reference/block-kit/block-elements#input),
    [checkboxes](https://api.slack.com/reference/block-kit/block-elements#checkboxes) and [radio buttons](https://api.slack.com/reference/block-kit/block-elements#radio).
    `paramsMeta` is sent in [private_metadata](https://api.slack.com/reference/surfaces/views) in modal submissions.
- `addHiddenParamsMeta`
  - Parameters: hiddenParamsMeta (object)
  - Description: To pass on internal parameters on modal submit. `hiddenParamsMeta` contains hidden parameters which has to pass for next modal action.
      `hiddenParamsMeta` is sent in [private_metadata](https://api.slack.com/reference/surfaces/views) in modal submissions.
- `addAction`
  - Parameters: actionName (string)
  - Description: You can provide the next action method/route to be executed on modal submit. As all the interactive component interactions are sent to a single request URL, this `actionName` helps in deciding what needs to be done.
  `actionName` is sent in [private_metadata](https://api.slack.com/reference/surfaces/views) in modal submissions.
- `open`
  - Parameters: triggerId (string)
  - Description: Opens modal using the trigger id, which expires in 3 seconds. `triggerId` is obtained from [interaction payload](https://api.slack.com/interactivity/handling#payloads).

#### Example

```javascript
const triggerId = 'Trigger ID obtained in payload';
const apiAppId = 'A03GGU0AKKK'; // slack app id
const modal = new slackmin.interactiveElements.Modal(apiAppId, 'Give your vote');

// These are the parameter names for the subsequent textboxes.
const paramsMeta = ['name', 'member_id', 'designation', 'projects'];
modal.addParamsMeta(paramsMeta);

const hiddenParamsMeta = {param1: "value1"};
modal.addHiddenParamsMeta(hiddenParamsMeta);

modal.addAction('submitForm');

modal.addMarkdownTextContext('`Hello` *World!*');

modal.addPlainTextSection('Hello World!');

modal.addDivider();

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

modal.open(triggerId);
```
Output of above code is shown in the screenshot below.

<img width="575" alt="Modal wrapper example" src="https://user-images.githubusercontent.com/7627517/171832112-a87d979d-378a-44ea-b191-14c2306eb2db.png">

### Journey of Hidden Parameters
In this section, we will go through an example of our convention if handling hidden parameters. Hidden parameters have the contextual information needed for the CRUD operations like entity id, etc.

Following are the different parts of our example:
#### Part 1
A slash command which sends a message with interactive buttons in it (refer Message Wrapper documentation for creating of message UI).
The hidden parameters (user_id in our example) must be present in the value of the button element as shown in the following snippet.

```javascript
// hiddenParams in value are internal params that need to be forwarded
const testButton1 = {
      buttonText: 'Test Button 1',
      confirmText: 'Do you want to really click the test button 1?',
      value:
        "{\"action\":\"testModal1Open\",\"hiddenParams\":{\"user_id\":\"123\"}}"
    };

// Refer the snippet given in section "Example 1 - Async Message" for the complete idea.
actionButtons.push(testButton1);
```

#### Part 2
When the button in the message is clicked, a confirmation popup is shown. On confirmation, a POST API call comes from slack to the interactive request URL (which was set in "Slack app setup" section above).
The block submission payload which comes from slack is converted to api parameters and assigned to `req.decodedParams` by our Interactive Component Middlewares.

#### Part 3
A modal UI is created and opened using our Modal wrapper. Hidden parameters are forwarded to the modal view using `addHiddenParamsMeta` method of the Modal wrapper (refer documentation above).

#### Part 4
On submission of the modal, the hidden parameters are obtained in the view submission payload, which is parsed and parameters are assigned to `req.decodedParams` by our Interactive Component Middlewares.

# Contributors
[Divyajyoti Ukirde](https://plgworks.com/blog/author/divyajyoti/), [Shraddha Falane](https://plgworks.com/blog/author/shraddha/), [Kedar Chandrayan](https://plgworks.com/blog/author/kedar/), [Parv Saxena](https://plgworks.com/blog/author/parv/)

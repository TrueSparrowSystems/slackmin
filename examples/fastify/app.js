const slackmin = require('./slackmin.js');
const fastify = require('fastify')();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function revenueModalSubmitHandler(req, res, next) {
  const responseUrl = req.decodedParams.response_url;
  const message = new slackmin.interactiveElements.Message();
  message.addDivider();
  const text = 'Revenue of last year requested by Suzanne Mayweather';
  message.addSection(`*${text}*`);
  message.addDivider();

  /**
   Your business logic for computing revenue data goes here
   */

  // If the computation is time consuming, you can preserve the
  // responseUrl and use it within 30 mins.
  const texts = [
    'Items Sold: 1,850,375\n',
    'Total Revenue: $92,518,754.76\n',
    'Items Returned: 65,008\n',
    'Total Refunds: $3,700,750.84\n',
    'Freight Charges: $6,009,381.86\n',
    'Stripe Fees: $1,687,194.64\n',
    'Other Operational Costs: $8,575,909,43\n',
    'Total profit: $63,966,608.56\n'
  ];

  message.addSectionWithTextFields(texts);

  await message.sendUsingResponseUrl(responseUrl);
  return res.status(200).json();
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function getOrderDetailsCommandHandler(req, res, next) {
  const responseUrl = req.decodedParams.response_url;
  /**
   * Your business logic for fetching order details goes here.
   * Order ID was passed to the slash command as input.
   * You can access Order ID using req.decodedParams.text
   */
  const orderId = req.decodedParams.text;

  const message = new slackmin.interactiveElements.Message();
  message.addSection('*Order Details requested by Antonio G.*');
  message.addDivider();

  message.addSectionWithTextFields([
    '*Order ID*:',
    '2447906',
    '*Ordered by*:',
    'Sharyn Scott',
    '*Date*:',
    '13th July, 2022',
    '*Order Value*:',
    ' $198.9 USD',
    '*Status*:',
    'Delivered'
  ]);
  message.addDivider();

  message.addSection('*Item Ordered*');
  message.addSectionWithTextFields([
    '1 X ldasen Standing Desk (1874)',
    '1 X Hoppvals Cellular Blinds (4086)',
    '1 X Fornuftig Air Purifier (7069)'
  ]);
  message.addDivider();

  message.addSectionWithTextFields([
    '*Delivery Partner*:',
    'FastPort',
    '*Tracking URL*:',
    'https://www.example.com/ord_id="14263482"'
  ]);

  const actionButtons = [];
  actionButtons.push({
    buttonText: 'User Order History',
    value: `{"action":"getUserOrderHistory","hiddenParams":{"order_id": "${orderId}", "response_url":"${responseUrl}"}}`
  });

  actionButtons.push({
    buttonText: 'Issue Refund',
    confirmText: 'You are issuing refund for an order',
    value: `{"action":"issueRefundModalOpen","hiddenParams":{"order_id": "${orderId}", "response_url":"${responseUrl}"}}`
  });

  // Following buttons won't work as we will not implement the handlers.
  actionButtons.push({
    buttonText: 'Initiate Return',
    value: `{"action":"initiateReturnModalOpen","hiddenParams":{"order_id": "${orderId}", "response_url":"${responseUrl}"}}`
  });

  actionButtons.push({
    buttonText: 'Raise issue',
    value: `{"action":"raiseIssueModalOpen","hiddenParams":{"order_id": "${orderId}", "response_url":"${responseUrl}"}}`
  });

  message.addButtonElements(actionButtons);
  await message.sendUsingResponseUrl(responseUrl);

  return res.status(200).json();
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function editSellerModalOpenHandler(req, res, next) {
  const triggerId = req.decodedParams.trigger_id;
  const apiAppId = req.decodedParams.api_app_id;
  const responseUrl = req.decodedParams.response_url;

  const modal = new slackmin.interactiveElements.Modal(apiAppId, 'Seller Details');

  modal.addAction('editSellerModalSubmit');

  const paramsMeta = [
    'name',
    'sellerAddressLine1',
    'sellerAddressLine2',
    'sellerCity',
    'sellerPincode',
    'sellerCountry',
    'owner',
    'email',
    'phoneNumber',
    'regions',
    'paymentAccountNumber',
    'paymentAccountName',
    'swiftCode',
    'paymentAddressLine1',
    'paymentAddressLine2',
    'paymentCity',
    'paymentPincode',
    'paymentCountry'
  ];
  modal.addParamsMeta(paramsMeta);

  /**
   * Your business logic for fetching seller details to render the modal goes here.
   */

  // Carry forward the seller id in hidden params, which will be available at the time of update.
  const sellerId = req.decodedParams.seller_id;
  modal.addHiddenParamsMeta({ response_url: responseUrl, seller_id: sellerId });

  modal.addSubmitAndCancel('confirm', 'cancel');

  modal.addTextbox('Seller Name', false, false, 'Stevensons');
  modal.addDivider();
  modal.addPlainTextSection('Seller Address:');
  modal.addTextbox('Address Line 1', false, false, 'C-19, Bronxville Knolls Tower');
  modal.addTextbox('Address Line 2', false, false, '1200 Midland Ave, Yonkers');
  modal.addTextbox('City', false, false, 'New York');
  modal.addTextbox('Pincode', false, false, '10708');
  modal.addTextbox('Country', false, false, 'United States');
  modal.addDivider();
  modal.addTextbox('Owner of the company', false, false, 'Ronnie Stevenson');
  modal.addTextbox('Contact Email', false, false, 'contact@stevensons.com');
  modal.addTextbox('Contact Number', false, false, '+12125675643');
  modal.addDivider();
  modal.addCheckBoxes(
    'Regions Active In',
    [
      { text: 'Austria', value: '1' },
      { text: 'Canada', value: '2' },
      { text: 'France', value: '3' },
      { text: 'Italy', value: '4' },
      { text: 'Germany', value: '5' },
      { text: 'Greece', value: '6' },
      { text: 'Mexico', value: '7' },
      { text: 'Norway', value: '8' },
      { text: 'United Kingdom', value: '9' },
      { text: 'United States', value: '10' }
    ],
    [
      { text: 'Canada', value: '2' },
      { text: 'France', value: '3' },
      { text: 'Germany', value: '5' },
      { text: 'United Kingdom', value: '9' },
      { text: 'United States', value: '10' }
    ]
  );
  modal.addDivider();
  modal.addTextbox('Payment Account Number', false, false, '69024520874');
  modal.addTextbox('Payment Account Name', false, false, 'contact@stevensons.com');
  modal.addTextbox('Swift Code', false, false, 'CHASUS3AXXX', 'write here');
  modal.addDivider();
  modal.addPlainTextSection('Payment Address:');
  modal.addTextbox('Address Line 1', false, false, 'C-19, Bronxville Knolls Tower');
  modal.addTextbox('Address Line 2', false, false, '1200 Midland Ave, Yonkers');
  modal.addTextbox('City', false, false, 'New York');
  modal.addTextbox('Pincode', false, false, '10708');
  modal.addTextbox('Country', false, false, 'United States');
  modal.addDivider();
  await modal.open(triggerId);

  return res.status(200).json();
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function editSellerModalSubmitHandler(req, res, next) {
  const message = new slackmin.interactiveElements.Message();

  const responseUrl = req.decodedParams.response_url;
  const sellerId = req.decodedParams.seller_id;

  /**
   * Your business logic for updating seller details to render the modal goes here.
   */

  message.addDivider();

  const text = 'Details of Seller #1254 updated by Allison Brie';
  message.addSection(`*${text}*`);
  message.addDivider();

  message.addSection('*Old Regions Active In*');
  message.addSectionWithTextFields(['Canada', 'France', 'Germany', 'United Kingdom', 'United States']);
  message.addSection('*New Regions Active In*');
  message.addSectionWithTextFields(['Canada', 'France', 'Italy', 'Germany', 'Greece', 'Mexico', 'United States']);
  message.addDivider();

  message.addSection(`*Payment Account Number Changed*`);
  message.addSectionWithTextFields(['*From*:', '*To*:', '65652325678', '69024520874']);
  await message.sendUsingResponseUrl(responseUrl);

  return res.status(200).json();
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function getReportCommandHandler(req, res, next) {
  const responseUrl = req.decodedParams.response_url;
  const message = new slackmin.interactiveElements.Message();
  /**
   * Your business logic for generating report according to report type goes here.
   * Report type was passed to the slash command as input.
   * You can access Report type using req.decodedParams.text
   */
  const reportType = req.decodedParams.text;

  message.addDivider();

  message.addSection('*User Reports requested by Gerald Hoffman*');
  message.addDivider();

  message.addSectionWithTextFields([
    '*User Report*:',
    'https://docs.google.com/spreadsheets/d/1jE2f-AbkUsODpO5372Yb14hdGbYLIQcv/edit?usp=sharing&ouid=106652506264447183160&rtpof=true&sd=true'
  ]);
  await message.sendUsingResponseUrl(responseUrl);

  return res.status(200).json();
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function revenueSlashCommandHandler(req, res, next) {
  const triggerId = req.decodedParams.trigger_id;
  const responseUrl = req.decodedParams.response_url;
  const apiAppId = req.decodedParams.api_app_id;
  const modal = new slackmin.interactiveElements.Modal(apiAppId, 'Revenue');

  modal.addAction('revenueModalSubmit');

  const paramsMeta = ['duration'];
  modal.addParamsMeta(paramsMeta);
  modal.addHiddenParamsMeta({ response_url: responseUrl });
  modal.addRadioButtons('Select a revenue duration', [
    { text: 'Today', value: 'today' },
    { text: 'Last Week', value: 'last_week' },
    { text: 'Last Month', value: 'last_month' },
    { text: 'Last Year', value: 'last_year' },
    { text: 'All time', value: 'all_time' }
  ]);

  modal.addSubmitAndCancel();
  await modal.open(triggerId);
  return res.status(200).json();
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function getUserOrderHistoryHandler(req, res, next) {
  const message = new slackmin.interactiveElements.Message();
  const responseUrl = req.decodedParams.response_url;

  /**
   * Your business logic for fetching user order history and creating excel goes here.
   * You can access Order ID using req.decodedParams.order_id.
   * From this order ID, you can find user ID for which user order history is to be fetched.
   */
  const orderId = req.decodedParams.order_id;

  message.addSection('*Order history for User #252618 requested by Antonio G*');
  message.addDivider();

  const texts = [
    'Order History Report',
    'https://docs.google.com/spreadsheets/d/1LTOL_kPMbnuvVJijfXYcm7UC4EVgnb8C/edit#gid=1117634679'
  ];
  message.addSectionWithTextFields(texts);

  await message.sendUsingResponseUrl(responseUrl);

  return res.status(200).json();
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function issueRefundModalOpenHandler(req, res, next) {
  const triggerId = req.decodedParams.trigger_id;
  const responseUrl = req.decodedParams.response_url;
  const apiAppId = req.decodedParams.api_app_id;
  const orderId = req.decodedParams.order_id;

  const modal = new slackmin.interactiveElements.Modal(apiAppId, 'Issue Refund');
  modal.addAction('issueRefundModalSubmit');

  const paramsMeta = ['refundMethod', 'amount', 'note'];
  modal.addParamsMeta(paramsMeta);

  modal.addHiddenParamsMeta({ response_url: responseUrl, order_id: orderId });
  modal.addRadioButtons('How would you like to issue refund?', [
    { text: 'Original Payment Method', value: '1' },
    { text: 'Account Credits', value: '2' }
  ]);
  modal.addTextbox('Input amount', false, false);
  modal.addTextbox('Add a Note', true, false);
  modal.addSubmitAndCancel();
  await modal.open(triggerId);

  return res.status(200).json();
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function issueRefundModalSubmitHandler(req, res, next) {
  const message = new slackmin.interactiveElements.Message();
  const responseUrl = req.decodedParams.response_url;
  /**
   * Your business logic for refund for order goes here.
   * You can access Order ID using req.decodedParams.order_id
   * If refund is time taking, you can respond asynchronously using responsUrl within 30 mins.
   */
  const orderId = req.decodedParams.order_id;

  message.addSection('*Amount Refunded for order #2447906 by Antonio G.*');
  message.addDivider();

  message.addSectionWithTextFields([
    '*Order Value*:\n $96.99 USD',
    '*Refund Method*:\n Original Payment Method',
    '*Note*:\n Refunded because air purifier is defective according to customer'
  ]);
  await message.sendUsingResponseUrl(responseUrl);

  return res.status(200).json();
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function getSellerSlashCommandHandler(req, res, next) {
  const message = new slackmin.interactiveElements.Message();
  const responseUrl = req.decodedParams.response_url;

  /**
   * Your business logic for fetching seller details goes here.
   * Seller ID was passed to the slash command as input.
   * You can access seller ID using req.decodedParams.text
   */

  const sellerId = req.decodedParams.text;

  const text = 'Seller Details requested by Allison Brie';
  message.addSection(`*${text}*`);
  message.addDivider();

  const texts = [
    '*Seller ID*:',
    '1254',
    '*Seller Name*:',
    'Stevensons',
    '*Revenue this month*:',
    '$13450 USD',
    '*Revenue all time*:',
    '$600,000 USD',
    '*Tier*:',
    'Platinum',
    '*Seller Country*',
    'United States'
  ];
  message.addSectionWithTextFields(texts);
  message.addDivider();

  const texts1 = ['*Seller Rating*', '*User Reviews*', '94%', '2476 (<http://www.example.com| View All>)'];
  message.addSectionWithTextFields(texts1);
  message.addDivider();

  message.addSection('*Regions Active In*');
  const texts3 = ['Canada', 'France', 'Germany', 'United Kingdom', 'United States'];
  message.addSectionWithTextFields(texts3);

  const actionButtons = [];
  actionButtons.push({
    buttonText: 'Edit Seller Details',
    confirmText: 'You are changing seller information',
    value: `{"action":"editSellerModalOpen","hiddenParams":{"seller_id": "${sellerId}", "response_url":"${responseUrl}"}}`
  });

  // Following buttons won't work as we will not implement the handlers.
  actionButtons.push({
    buttonText: 'Issue Payout',
    value: `{"action":"issuePayoutModalOpen","hiddenParams":{"seller_id": "${sellerId}", "response_url":"${responseUrl}"}}`
  });

  actionButtons.push({
    buttonText: 'View Items Sold',
    value: `{"action":"viewItemSoldModalOpen","hiddenParams":{"seller_id": "${sellerId}", "response_url":"${responseUrl}"}}`
  });

  actionButtons.push({
    buttonText: 'Change Tier',
    value: `{"action":"changeTierOpenModal","hiddenParams":{"seller_id": "${sellerId}", "response_url":"${responseUrl}"}}`
  });

  message.addButtonElements(actionButtons);
  await message.sendUsingResponseUrl(responseUrl);

  return res.status(200).json();
}

// Configure interactive endpoint with slackmin interactive middlewares
router.post('/api/slack/interactive-endpoint', slackmin.interactiveEndpointMiddlewares, async function(req, res, next) {
  const apiName = req.internalDecodedParams.apiName;

  if (apiName === 'revenueModalSubmit') {
    return revenueModalSubmitHandler(req, res, next);
  } else if (apiName === 'getUserOrderHistory') {
    return getUserOrderHistoryHandler(req, res, next);
  } else if (apiName === 'issueRefundModalOpen') {
    return issueRefundModalOpenHandler(req, res, next);
  } else if (apiName === 'issueRefundModalSubmit') {
    return issueRefundModalSubmitHandler(req, res, next);
  } else if (apiName === 'editSellerModalOpen') {
    return editSellerModalOpenHandler(req, res, next);
  } else if (apiName === 'editSellerModalSubmit') {
    return editSellerModalSubmitHandler(req, res, next);
  }
  throw new Error(`unknown apiName ${apiName}`);
});

// Configure slash command endpoint to get report according to report type with slash command middlewares
// Analytics
router.post(
  '/api/slack/report',
  slackmin.slashCommandMiddlewares,
  getReportCommandHandler // NOTE: Defined in later step
);

// Configure slash command endpoint to get revenue  with slash command middlewares
// Analytics
router.post(
  '/api/slack/revenue',
  slackmin.slashCommandMiddlewares,
  revenueSlashCommandHandler // NOTE: Defined in later step
);

// Configure slash command endpoint to get user order details  with slash command middlewares
//customer support
router.post(
  '/api/slack/order',
  slackmin.slashCommandMiddlewares,
  getOrderDetailsCommandHandler // NOTE: Defined in later step
);

// Configure slash command endpoint to get and edit seller details with slash command middlewares
// Content Management
router.post(
  '/api/slack/seller',
  slackmin.slashCommandMiddlewares,
  getSellerSlashCommandHandler // NOTE: Defined in later step
);

fastify.register(require('@fastify/express')).after(() => {
  fastify.use(bodyParser.json({ limit: '2mb' }));
  fastify.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));

  // slackmin common middlewares
  fastify.use(slackmin.commonMiddlewares);

  fastify.use(router);
});

fastify.listen({ port: 3000 }, console.log);

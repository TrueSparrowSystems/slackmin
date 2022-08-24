const Koa = require('koa');
const koaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const slackmin = require('./slackmin.js');

const app = new Koa();
const router = new koaRouter();

app.use(bodyParser());

// Slackmin common middleware methods middleware
app.use(async function(ctx, next) {
  try {
    const response = await slackmin.validators.common(
      ctx.request.body,
      ctx.request.query,
      ctx.request.headers,
      ctx.request.method
    );

    ctx.request.body = response.requestBody;
    ctx.request.query = response.requestQuery;
    ctx.request.internalDecodedParams = response.internalDecodedParams;
    ctx.request.decodedParams = response.decodedParams;
    next();
  } catch (errorMessage) {
    console.error('Common middleware error:', errorMessage);
    return (ctx.status = 200);
  }
});

// Slackmin slash command  middleware methods middleware
async function slashCommands(ctx, next) {
  try {
    const response = await slackmin.validators.slashCommands(
      ctx.request.body,
      ctx.request.rawBody,
      ctx.request.headers,
      ctx.request.decodedParams
    );

    ctx.request.body = response.requestBody;
    ctx.request.decodedParams = response.decodedParams;
    next();
  } catch (errorMessage) {
    console.error('Slash command middleware error:', JSON.stringify(err));
    return (ctx.status = 200);
  }
}

// Slackmin Interactive endpoint middleware methods middleware
async function interactiveEndpoint(ctx, next) {
  try {
    const response = await slackmin.validators.interactive(
      ctx.request.params,
      ctx.request.body,
      ctx.request.headers,
      ctx.request.decodedParams,
      ctx.request.internalDecodedParams
    );

    ctx.request.params = response.requestParams;
    ctx.request.sanitizedHeaders = response.internalDecodedParams.headers;
    ctx.request.internalDecodedParams = response.internalDecodedParams;
    ctx.request.decodedParams = response.decodedParams;
    next();
  } catch (errorMessage) {
    console.error('Interactive endpoint middleware error:', JSON.stringify(err));
    return (ctx.status = 200);
  }
}

async function getReportCommandHandler(ctx) {
  const responseUrl = ctx.request.decodedParams.response_url;
  const message = new slackmin.interactiveElements.Message();
  /**
   * Your business logic for generating report according to report type goes here.
   * Report type was passed to the slash command as input.
   * You can access Report type using ctx.request.decodedParams.text
   */
  const reportType = ctx.request.decodedParams.text;
  message.addDivider();
  message.addSection('*User Reports requested by Gerald Hoffman*');
  message.addDivider();
  message.addSectionWithTextFields([
    '*User Report*:',
    'https://docs.google.com/spreadsheets/d/1jE2f-AbkUsODpO5372Yb14hdGbYLIQcv/edit?usp=sharing&ouid=106652506264447183160&rtpof=true&sd=true'
  ]);
  await message.sendUsingResponseUrl(responseUrl);
  return (ctx.status = 200);
}

async function revenueSlashCommandHandler(ctx) {
  const triggerId = ctx.request.decodedParams.trigger_id;
  const responseUrl = ctx.request.decodedParams.response_url;
  const apiAppId = ctx.request.decodedParams.api_app_id;
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
  return (ctx.status = 200);
}

async function revenueModalSubmitHandler(ctx) {
  const responseUrl = ctx.request.decodedParams.response_url;
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
  return (ctx.status = 200);
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function getOrderDetailsCommandHandler(ctx) {
  const responseUrl = ctx.request.decodedParams.response_url;
  /**
   * Your business logic for fetching order details goes here.
   * Order ID was passed to the slash command as input.
   * You can access Order ID using ctx.request.decodedParams.text
   */
  const orderId = ctx.request.decodedParams.text;

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
  return (ctx.status = 200);
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function getUserOrderHistoryHandler(ctx) {
  const message = new slackmin.interactiveElements.Message();
  const responseUrl = ctx.request.decodedParams.response_url;

  /**
   * Your business logic for fetching user order history and creating excel goes here.
   * You can access Order ID using ctx.request.decodedParams.order_id.
   * From this order ID, you can find user ID for which user order history is to be fetched.
   */
  const orderId = ctx.request.decodedParams.order_id;

  message.addSection('*Order history for User #252618 requested by Antonio G*');
  message.addDivider();

  const texts = [
    'Order History Report',
    'https://docs.google.com/spreadsheets/d/1LTOL_kPMbnuvVJijfXYcm7UC4EVgnb8C/edit#gid=1117634679'
  ];
  message.addSectionWithTextFields(texts);

  await message.sendUsingResponseUrl(responseUrl);

  return (ctx.status = 200);
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function issueRefundModalOpenHandler(ctx) {
  const triggerId = ctx.request.decodedParams.trigger_id;
  const responseUrl = ctx.request.decodedParams.response_url;
  const apiAppId = ctx.request.decodedParams.api_app_id;
  const orderId = ctx.request.decodedParams.order_id;

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
  return (ctx.status = 200);
}

// Following function was used in app.js.
// Paste the following definition anywhere above the usage.
async function issueRefundModalSubmitHandler(ctx) {
  const message = new slackmin.interactiveElements.Message();
  const responseUrl = ctx.request.decodedParams.response_url;
  /**
   * Your business logic for refund for order goes here.
   * You can access Order ID using ctx.request.decodedParams.order_id
   * If refund is time taking, you can respond asynchronously using responsUrl within 30 mins.
   */
  const orderId = ctx.request.decodedParams.order_id;

  message.addSection('*Amount Refunded for order #2447906 by Antonio G.*');
  message.addDivider();

  message.addSectionWithTextFields([
    '*Order Value*:\n $96.99 USD',
    '*Refund Method*:\n Original Payment Method',
    '*Note*:\n Refunded because air purifier is defective according to customer'
  ]);
  await message.sendUsingResponseUrl(responseUrl);
  return (ctx.status = 200);
}

async function getSellerSlashCommandHandler(ctx) {
  const message = new slackmin.interactiveElements.Message();
  const responseUrl = ctx.request.decodedParams.response_url;

  /**
   * Your business logic for fetching seller details goes here.
   * Seller ID was passed to the slash command as input.
   * You can access seller ID using ctx.request.decodedParams.text
   */

  const sellerId = ctx.request.decodedParams.text;

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
  return (ctx.status = 200);
}

async function editSellerModalOpenHandler(ctx) {
  const triggerId = ctx.request.decodedParams.trigger_id;
  const apiAppId = ctx.request.decodedParams.api_app_id;
  const responseUrl = ctx.request.decodedParams.response_url;

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
  const sellerId = ctx.request.decodedParams.seller_id;
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
  return (ctx.status = 200);
}

async function editSellerModalOpenHandler(ctx) {
  const triggerId = ctx.request.decodedParams.trigger_id;
  const apiAppId = ctx.request.decodedParams.api_app_id;
  const responseUrl = ctx.request.decodedParams.response_url;

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
  const sellerId = ctx.request.decodedParams.seller_id;
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
  ctx.status = 200;
}

async function editSellerModalSubmitHandler(ctx) {
  const message = new slackmin.interactiveElements.Message();

  const responseUrl = ctx.request.decodedParams.response_url;
  const sellerId = ctx.request.decodedParams.seller_id;

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
  return (ctx.status = 200);
}

// Configure slash command endpoint to get report according to report type with slash command middlewares
// Analytics
router.post('/api/slack/report', slashCommands, getReportCommandHandler);

// Configure slash command endpoint to get revenue  with slash command middlewares
// Analytics
router.post(
  '/api/slack/revenue',
  slashCommands,
  revenueSlashCommandHandler // NOTE: Defined in later step
);

// Configure slash command endpoint to get user order details  with slash command middlewares
//customer support
router.post(
  '/api/slack/order',
  slashCommands,
  getOrderDetailsCommandHandler // NOTE: Defined in later step
);

// Configure slash command endpoint to get and edit seller details with slash command middlewares
// Content Management
router.post(
  '/api/slack/seller',
  slashCommands,
  getSellerSlashCommandHandler // NOTE: Defined in later step
);

// Configure interactive endpoint with middlewares
router.post('/api/slack/interactive-endpoint', interactiveEndpoint, async function(ctx) {
  const apiName = ctx.request.internalDecodedParams.apiName;

  if (apiName === 'revenueModalSubmit') {
    return revenueModalSubmitHandler(ctx);
  } else if (apiName === 'getUserOrderHistory') {
    return getUserOrderHistoryHandler(ctx);
  } else if (apiName === 'issueRefundModalOpen') {
    return issueRefundModalOpenHandler(ctx);
  } else if (apiName === 'issueRefundModalSubmit') {
    return issueRefundModalSubmitHandler(ctx);
  } else if (apiName === 'editSellerModalOpen') {
    return editSellerModalOpenHandler(ctx);
  } else if (apiName === 'editSellerModalSubmit') {
    return editSellerModalSubmitHandler(ctx);
  }

  throw new Error(`unknown apiName ${apiName}`);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);

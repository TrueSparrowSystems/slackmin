const { v4: uuidV4 } = require('uuid');

const rootPrefix = '../..',
  CommonValidators = require(rootPrefix + '/lib/validator/Common'),
  slackHelper = require(rootPrefix + '/lib/helpers/messageHelper'),
  slackWrapper = require(rootPrefix + '/lib/slack/Wrapper'),
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper');

/**
 * Class to create Slack message.
 *
 * @class Message
 */
class Message {
  /**
   * Constructor to create Slack message.
   *
   * @constructor
   */
  constructor() {
    const oThis = this;

    oThis.errorUuidToTextMap = {};

    oThis.messageJSON = {
      blocks: []
    };
  }

  /**
   * Add section.
   *
   * @param {string} text
   *
   * @sets oThis.messageJson
   */
  addSection(text) {
    const oThis = this;

    // Text must be less than 3001 characters.
    if (text.length > 3000) {
      const uniqueString = uuidV4();
      oThis.errorUuidToTextMap[uniqueString] = text;

      text = `There is a big data here. Please submit this string to the dev team to get the complete data: ${uniqueString}`;
    }

    const sectionJSON = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: text
      }
    };

    oThis.messageJSON.blocks.push(sectionJSON);
  }

  /**
   * Add section with text fields
   *
   * @param {array} texts
   *
   * @sets oThis.messageJson
   */
  addSectionWithTextFields(texts) {
    const oThis = this;

    const SECTION_LIMIT = 10;

    for (let txtIndex = 0; txtIndex < texts.length; txtIndex += SECTION_LIMIT) {
      const localArray = texts.slice(txtIndex, txtIndex + SECTION_LIMIT);

      const sectionJSON = {
        type: 'section',
        fields: []
      };

      for (let localArrayIndex = 0; localArrayIndex < localArray.length; localArrayIndex++) {
        let text = localArray[localArrayIndex];

        // Text must be less than 3001 characters.
        if (text.length > 3000) {
          const uniqueString = uuidV4();
          oThis.errorUuidToTextMap[uniqueString] = text;

          text = `There is a big data here. Please submit this string to the dev team to get the complete data: ${uniqueString}`;
        }

        sectionJSON.fields.push({
          type: 'mrkdwn',
          text: text
        });
      }

      oThis.messageJSON.blocks.push(sectionJSON);
    }
  }

  /**
   * Add button to message.
   *
   * @param {string} labelText
   * @param {string} buttonText
   * @param {string} value
   *
   * @sets oThis.messageJson
   */
  addButton(labelText, buttonText, value) {
    const oThis = this;

    const buttonJSON = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: labelText
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: buttonText,
          emoji: true
        },
        value: value
      }
    };

    oThis.messageJSON.blocks.push(buttonJSON);
  }

  /**
   * Add button elements - multiple buttons
   *
   * @param {array} buttonDetails (array of objects with keys - buttonText, value, confirmText)
   *
   * @sets oThis.messageJSON
   */
  addButtonElements(buttonDetails) {
    const oThis = this;

    if (!buttonDetails.length) {
      return;
    }

    const buttonJSON = {
      type: 'actions',
      elements: []
    };

    for (let index = 0; index < buttonDetails.length; index++) {
      const currButtonDetail = buttonDetails[index];

      if (!currButtonDetail || !Object.keys(currButtonDetail).length) {
        continue;
      }

      const buttonElement = {
        type: 'button',
        text: {
          type: 'plain_text',
          text: currButtonDetail.buttonText,
          emoji: true
        },
        value: currButtonDetail.value
      };

      if (currButtonDetail.confirmText) {
        buttonElement.confirm = {
          title: {
            type: 'plain_text',
            text: 'Are you sure?'
          },
          text: {
            type: 'mrkdwn',
            text: currButtonDetail.confirmText
          },
          confirm: {
            type: 'plain_text',
            text: 'Confirm'
          },
          deny: {
            type: 'plain_text',
            text: 'Cancel'
          }
        };
      }

      buttonJSON.elements.push(buttonElement);
    }

    if (!buttonJSON.elements.length) return;

    oThis.messageJSON.blocks.push(buttonJSON);
  }

  /**
   * Add divider to message.
   *
   * @sets oThis.messageJSON
   */
  addDivider() {
    const oThis = this;

    const dividerJSON = {
      type: 'divider'
    };

    oThis.messageJSON.blocks.push(dividerJSON);
  }

  // Custom methods for slack admin start.

  /**
   * Add custom header.
   *
   * @param {string} text
   */
  addCustomHeader(text) {
    const oThis = this;

    oThis.addDivider();

    oThis.addSection(text);
  }

  /**
   * Add custom footer.
   */
  addCustomFooter() {
    // Do nothing.
  }

  // Custom methods for slack admin end.

  /**
   * Convert message to JSON.
   *
   * @returns {{blocks: []}}
   */
  toJson() {
    const oThis = this;

    return oThis.messageJSON;
  }

  /**
   * Send message using response URL.
   *
   * @param {string} responseUrl
   * @param {boolean} [isTemporary]
   *
   * @returns {Promise<never>}
   */
  async sendUsingResponseUrl(responseUrl, isTemporary = false) {
    const oThis = this;

    // Notify devs about error uuids if any.
    await oThis._notifyDevs();

    const messageParams = Object.assign({}, oThis.messageJSON, {
      isEphemeral: isTemporary,
      responseUrl: responseUrl
    });

    return slackHelper.sendMessageUsingResponseUrl(messageParams);
  }

  /**
   * Send message to channel.
   *
   * @param {object} postMessageParams
   * @param {string} postMessageParams.channel
   * @param {string} postMessageParams.text
   * @param {string} [slackDomain] - slack domain. If not passed, then the first app's domain is taken.
   *
   * @returns {Promise<void>}
   */
  async sendMessageToChannel(postMessageParams, slackDomain) {
    const oThis = this;

    // Notify devs about error uuids if any.
    await oThis._notifyDevs();

    const updatedPostMessageParams = {
      channel: postMessageParams.channel
    };

    if (!postMessageParams.text) {
      return Promise.reject(
        responseHelper.error({
          internal_error_identifier: 'l_s_m_smtc_1',
          api_error_identifier: 'something_went_wrong',
          debug_options: { postMessageParams: postMessageParams }
        })
      );
    }
    updatedPostMessageParams.text = postMessageParams.text;

    if (slackDomain) {
      updatedPostMessageParams.slackDomain = slackDomain;
    }

    const blocksLength = oThis.messageJSON.blocks.length;

    if (blocksLength > 49) {
      const uniqueString = uuidV4();

      const errorObject = responseHelper.error({
        internal_error_identifier: 'l_s_m_smtc_2_message_length_exceeded',
        api_error_identifier: 'something_went_wrong',
        debug_options: { uniqueString: uniqueString, blocks: oThis.messageJSON.blocks }
      });

      console.error(errorObject);

      oThis.messageJSON.blocks = oThis.messageJSON.blocks.slice(0, 49);
      oThis.addSection(
        `There is some more data. Please submit this string to the dev team to get the complete data: ${uniqueString}.`
      );
    }

    const messageParams = Object.assign({}, oThis.messageJSON, updatedPostMessageParams);

    const postMessageResponse = await slackWrapper.chatPostMessage(messageParams);

    if (postMessageResponse.isSuccess()) {
      return;
    }
  }

  /**
   * Notify devs.
   *
   * @returns {Promise<void>}
   */
  async _notifyDevs() {
    const oThis = this;

    for (const uuid in oThis.errorUuidToTextMap) {
      const errorUuidToTextObj = oThis.errorUuidToTextMap[uuid];

      if (!CommonValidators.validateNonEmptyObject(errorUuidToTextObj)) {
        const errorObject = responseHelper.error({
          internal_error_identifier: 'l_s_m_nd_1_message_length_exceeded',
          api_error_identifier: 'something_went_wrong',
          debug_options: { uniqueString: uuid, text: errorUuidToTextObj }
        });

        console.error(errorObject);
      }
    }
  }
}

module.exports = Message;

const { App } = require('@slack/bolt');

const rootPrefix = '../..',
  slackAppConstants = require(rootPrefix + '/lib/constants/slackApp');

/**
 * Class to create slack modal.
 *
 * @class Modal
 */
class Modal {
  /**
   * Constructor to create slack modal.
   *
   * @param {string} apiAppId
   * @param {string} title
   *
   * @constructor
   */
  constructor(apiAppId, title) {
    const oThis = this;

    oThis.apiAppId = apiAppId;

    oThis.viewJSON = {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: title,
        emoji: true
      },
      blocks: []
    };

    oThis.paramsMeta = [];
    oThis.hiddenParamsMeta = {};
    oThis.actionName = '';
  }

  /**
   * Add submit and cancel button to modal.
   *
   * @param submitText
   * @param cancelText
   */
  addSubmitAndCancel(submitText = 'submit', cancelText = 'cancel') {
    const oThis = this;

    const submitJSON = {
      submit: {
        type: 'plain_text',
        text: submitText,
        emoji: true
      }
    };

    const cancelJSON = {
      close: {
        type: 'plain_text',
        text: cancelText,
        emoji: true
      }
    };

    Object.assign(oThis.viewJSON, submitJSON, cancelJSON);
  }

  /**
   * Add plain text section to modal.
   *
   * @param {string} text
   */
  addPlainTextSection(text) {
    const oThis = this;

    const textSectionJSON = {
      type: 'section',
      text: {
        type: 'plain_text',
        text: text,
        emoji: true
      }
    };

    oThis.viewJSON.blocks.push(textSectionJSON);
  }

  /**
   * Add markdown text section to modal.
   *
   * @param {string} text
   */
  addMarkdownTextContext(text) {
    const oThis = this;

    const contextJSON = {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: text
        }
      ]
    };

    oThis.viewJSON.blocks.push(contextJSON);
  }

  /**
   * Add divider to modal.
   */
  addDivider() {
    const oThis = this;

    const dividerJSON = {
      type: 'divider'
    };

    oThis.viewJSON.blocks.push(dividerJSON);
  }

  /**
   * Add text box to modal.
   *
   * @param {string} labelText
   * @param {boolean} multiline
   * @param {boolean} isOptional
   */
  addTextbox(labelText, multiline = true, isOptional = false) {
    const oThis = this;

    const textboxJSON = {
      type: 'input',
      label: {
        type: 'plain_text',
        text: labelText,
        emoji: true
      },
      element: {
        type: 'plain_text_input',
        multiline: multiline
      },
      optional: isOptional
    };

    oThis.viewJSON.blocks.push(textboxJSON);
  }

  /**
   * Add check boxes to modal.
   *
   * @param {string} labelText
   * @param {array<object>} optionsArray
   */
  addCheckBoxes(labelText, optionsArray) {
    const oThis = this;

    const checkBoxJson = {
      type: 'input',
      label: {
        type: 'plain_text',
        text: labelText,
        emoji: true
      },
      element: {
        type: 'checkboxes',
        options: []
      }
    };

    for (let index = 0; index < optionsArray.length; index++) {
      const currOption = optionsArray[index];

      checkBoxJson.element.options.push({
        text: {
          type: 'plain_text',
          text: currOption.text,
          emoji: true
        },
        value: currOption.value
      });
    }

    oThis.viewJSON.blocks.push(checkBoxJson);
  }

  /**
   * Add radio buttons to modal.
   *
   * @param {string} labelText
   * @param {array<object>} optionsArray
   * @param {object} [initialOption]
   */
  addRadioButtons(labelText, optionsArray, initialOption = {}) {
    const oThis = this;

    const radioJSON = {
      type: 'input',
      label: {
        type: 'plain_text',
        text: labelText,
        emoji: true
      },
      element: {
        type: 'radio_buttons',
        options: []
      }
    };

    for (let index = 0; index < optionsArray.length; index++) {
      const currOption = optionsArray[index];

      radioJSON.element.options.push({
        text: {
          type: 'plain_text',
          text: currOption.text,
          emoji: true
        },
        value: currOption.value
      });
    }

    if (initialOption.text && initialOption.value) {
      radioJSON.element.initial_option = {
        text: {
          type: 'plain_text',
          text: initialOption.text,
          emoji: true
        },
        value: initialOption.value
      };
    }

    oThis.viewJSON.blocks.push(radioJSON);
  }

  /**
   * Add params meta to modal.
   *
   * @sets oThis.paramsMeta
   *
   * @param {array<string>} paramsMeta
   */
  addParamsMeta(paramsMeta) {
    const oThis = this;

    oThis.paramsMeta = paramsMeta;
  }

  /**
   * Add hidden params meta to modal.
   *
   * @sets oThis.hiddenParamsMeta
   *
   * @param {object} hiddenParamsMeta
   */
  addHiddenParamsMeta(hiddenParamsMeta) {
    const oThis = this;

    oThis.hiddenParamsMeta = hiddenParamsMeta;
  }

  /**
   * Add action name to modal.
   *
   * @sets oThis.actionName
   *
   * @param {string} actionName
   */
  addAction(actionName) {
    const oThis = this;

    oThis.actionName = actionName;
  }

  /**
   * Convert modal to json.
   *
   * @returns {{blocks: [], type: string, title: {emoji: boolean, text: *, type: string}}}
   */
  toJson() {
    const oThis = this;

    oThis.viewJSON.private_metadata = JSON.stringify({
      params: oThis.paramsMeta,
      hiddenParams: oThis.hiddenParamsMeta,
      action: oThis.actionName
    });

    return oThis.viewJSON;
  }

  /**
   * Open modal.
   *
   * @param {string} triggerId
   *
   * @returns {Promise<void>}
   */
  async open(triggerId) {
    const oThis = this;

    const slackBotToken = slackAppConstants.getBotTokenForAppId(oThis.apiAppId);

    const app = new App({
      token: slackBotToken,
      signingSecret: slackAppConstants.getSigningSecretForAppId(oThis.apiAppId)
    });

    // Call the views.open method using the built-in WebClient.
    await app.client.views.open({
      // The token you used to initialize your app is stored in the `context` object.
      token: slackBotToken,
      trigger_id: triggerId,
      view: oThis.toJson()
    });
  }
}

module.exports = Modal;

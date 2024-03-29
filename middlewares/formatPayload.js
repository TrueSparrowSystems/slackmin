/**
 * Class for formatting and preprocessing slack payload
 * @class PayloadFormatter
 */
class PayloadFormatter {
  constructor() {}

  /**
   * Parse and regex replace processed links and user mention in slack payload.
   *
   * @param {*} params
   *
   * @returns {string|boolean|number|Array}
   */
  _preprocessSlackPayload(params) {
    const oThis = this;

    if (typeof params === 'string') {
      params = params.replace(/<(http)([^>\s]*)>/gi, '$1$2');
      params = params.replace(/<mailto:([^>\|\s]*)\|+([^><\s]*)>/gi, '$1');
    } else if (typeof params === 'boolean' || typeof params === 'number' || params === null) {
      // Do nothing and return param as is.
    } else if (params instanceof Array) {
      for (const index in params) {
        params[index] = oThis._preprocessSlackPayload(params[index]);
      }
    } else if (params instanceof Object) {
      Object.keys(params).forEach(function(key) {
        params[key] = oThis._preprocessSlackPayload(params[key]);
      });
      // eslint-disable-next-line no-negated-condition
    } else if (!params) {
      // Do nothing and return param as is.
    } else {
      console.error('Invalid params type in payload: ', typeof params);
      params = '';
    }

    return params;
  }

  /**
   * Format slack payload.
   *
   * @param {object} requestBody
   * @returns {string|boolean|number|Array|*}
   */
  formatPayload(requestBody) {
    const oThis = this;
    if (requestBody.payload) {
      const payload = JSON.parse(requestBody.payload);

      return oThis._preprocessSlackPayload(payload);
    }

    return null;
  }
}

module.exports = new PayloadFormatter();

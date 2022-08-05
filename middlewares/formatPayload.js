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
   * Convert string to JSON.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  formatPayload(req, res, next) {
    const oThis = this;
    if (req.body.payload) {
      const payload = JSON.parse(req.body.payload);

      req.body.payload = oThis._preprocessSlackPayload(payload);
      console.log('formatPayload success------------>>>>>>>>');
    }

    next();
  }
}

const _instance = new PayloadFormatter();

module.exports = (...args) => {
  _instance.formatPayload(...args);
};

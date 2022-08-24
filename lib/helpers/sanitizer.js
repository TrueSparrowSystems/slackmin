const sanitizeHtml = require('sanitize-html');

class SanitizeRecursively {
  /**
   * Recursively sanitize.
   *
   * @param {object} params
   *
   * @returns {*}
   * @private
   */
  sanitize_params_recursively(params) {
    const oThis = this;

    if (typeof params === 'string') {
      params = oThis._sanitizeString(params);
    } else if (typeof params === 'boolean' || typeof params === 'number' || params === null) {
      // Do nothing and return param as is.
    } else if (params instanceof Array) {
      for (const index in params) {
        params[index] = oThis.sanitize_params_recursively(params[index]);
      }
    } else if (params instanceof Object) {
      Object.keys(params).forEach(function(key) {
        params[key] = oThis.sanitize_params_recursively(params[key]);
      });
      // eslint-disable-next-line no-negated-condition
    } else if (!params) {
      params = oThis._sanitizeString(params);
    } else {
      // eslint-disable-next-line no-console
      console.error('Invalid params type: ', typeof params);
      params = '';
    }

    return params;
  }

  /**
   * Sanitize string
   *
   * @param str
   *
   * @private
   */
  _sanitizeString(str) {
    const sanitizedHtmlStr = sanitizeHtml(str, { allowedTags: [] });

    return sanitizedHtmlStr.replace(/javascript:/g, '');
  }
}

const sanitizeRecursively = new SanitizeRecursively();

class Sanitizer {
  /**
   * Sanitize Request body and request query params
   *
   * @param requestBody
   * @param requestQuery
   * @returns {{requestQuery: *, requestBody: *}}
   */
  sanitizeBodyAndQuery(requestBody, requestQuery) {
    requestBody = sanitizeRecursively.sanitize_params_recursively(requestBody);
    requestQuery = sanitizeRecursively.sanitize_params_recursively(requestQuery);

    return { requestBody, requestQuery };
  }

  /**
   * Sanitize dynamic params in URL
   *
   * @param {object} requestParams
   * @returns {*}
   */
  sanitizeDynamicUrlParams(requestParams) {
    return sanitizeRecursively.sanitize_params_recursively(requestParams);
  }

  /**
   *  Sanitize headers
   *
   * @param {object} requestHeaders
   * @returns {*}
   */
  sanitizeHeaderParams(requestHeaders) {
    return sanitizeRecursively.sanitize_params_recursively(requestHeaders);
  }

  /**
   * Sanitize object
   *
   * @param {object} params
   *
   * @returns {object}
   */
  sanitizeParams(params) {
    return sanitizeRecursively.sanitize_params_recursively(params);
  }
}

module.exports = new Sanitizer();

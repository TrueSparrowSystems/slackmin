const queryString = require('qs'),
  https = require('https'),
  http = require('http'),
  url = require('url');

const rootPrefix = '..',
  responseHelper = require(rootPrefix + '/lib/formatter/responseHelper');

/**
 * Class for HTTP request.
 *
 * @class HttpRequest
 */
class HttpRequest {
  /**
   * Constructor for HTTP request.
   *
   * @param {object} params
   * @param {string} params.resource
   * @param {object} [params.header]
   * @param {boolean} [params.noFormattingRequired]
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.resource = params.resource;
    oThis.header = params.header;
    oThis.noFormattingRequired = params.noFormattingRequired;
  }

  /**
   * Send get request.
   *
   * @param {object} [queryParams]: resource query parameters
   *
   * @public
   */
  get(queryParams = {}) {
    const oThis = this;

    return oThis._send('GET', queryParams);
  }

  /**
   * Send post request.
   *
   * @param {object} [queryParams]: resource query parameters
   *
   * @public
   */
  post(queryParams = {}) {
    const oThis = this;

    return oThis._send('POST', queryParams);
  }

  /**
   * Send delete request.
   *
   * @param {object} [queryParams]: resource query parameters
   *
   * @public
   */
  delete(queryParams = {}) {
    const oThis = this;

    return oThis._send('DELETE', queryParams);
  }

  /**
   * Get parsed URL
   *
   * @param {string} resource: API Resource
   *
   * @return {object} - parsed url object
   * @private
   */
  _parseURL(resource) {
    return url.parse(resource);
  }

  /**
   * Send request.
   *
   * @param {string} requestType: API request type
   * @param {object} queryParams: resource query parameters
   *
   * @returns {Promise<*>}
   * @private
   */
  async _send(requestType, queryParams) {
    const oThis = this;

    const parsedURL = oThis._parseURL(oThis.resource),
      requestData = oThis.formatQueryParams(queryParams);

    const options = {
      host: parsedURL.hostname,
      port: parsedURL.port,
      path: parsedURL.path,
      method: requestType,
      timeout: 300000,
      headersTimeout: 300000,
      keepAliveTimeout: 300000
    };

    if ((requestType === 'GET' || requestType === 'DELETE') && requestData) {
      options.path = options.path + '?' + requestData;
    }

    options.headers = oThis.header
      ? oThis.header
      : {
        'Content-Type': 'application/x-www-form-urlencoded'
      };

    if (requestType === 'POST' && requestData) {
      options.headers['Content-Length'] = Buffer.byteLength(requestData);
    }

    if (parsedURL.auth) {
      options.auth = parsedURL.auth;
    }

    return new Promise(function(onResolve, onReject) {
      let chunkedResponseData = '';

      const request = (parsedURL.protocol === 'https:' ? https : http).request(options, function(response) {
        response.setEncoding('utf8');

        response.on('data', function(chunk) {
          chunkedResponseData += chunk;
        });

        response.on('end', function() {
          onResolve(
            responseHelper.successWithData({
              responseData: chunkedResponseData,
              response: {
                headers: response.headers,
                status: response.statusCode
              }
            })
          );
        });
      });

      request.on('error', function(err) {
        onReject(
          responseHelper.error({
            internal_error_identifier: 'l_hr_2',
            api_error_identifier: 'something_went_wrong',
            debug_options: { error: err }
          })
        );
      });

      // Write data to server
      if (requestType === 'POST') {
        request.write(requestData);
      }

      request.end();
    });
  }

  /**
   * Format query params.
   *
   * @param {object/string} queryParams: query params
   *
   * @returns {void | string | never}
   */
  formatQueryParams(queryParams) {
    const oThis = this;

    if (oThis.noFormattingRequired) {
      return queryParams;
    }

    return queryString.stringify(queryParams).replace(/%20/g, '+');
  }
}

module.exports = HttpRequest;

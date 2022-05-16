class CommonValidator {
    /**
   * Is valid Boolean?
   *
   * @returns {boolean}
   */
  static validateBoolean(str) {
    const oThis = this;

    if (oThis.isVarNullOrUndefined(str)) {
      return false;
    }

    return str === 'true' || str === 'false' || str === true || str === false;
  }

  /**
   * Is var null or undefined?
   *
   * @param {object/string/integer/boolean} variable
   *
   * @returns {boolean}
   */
   static isVarNullOrUndefined(variable) {
    return typeof variable === 'undefined' || variable == null;
  }

  /**
   * Is var null?
   *
   * @param variable
   *
   * @returns {boolean}
   */
  static isVarNull(variable) {
    return variable == null;
  }

  /**
   * Is var undefined?
   *
   * @param variable
   *
   * @returns {boolean}
   */
  static isVarUndefined(variable) {
    return typeof variable === 'undefined';
  }

  /**
   * Is var not blank or null?
   *
   * @param {array<string>} variable
   *
   * @returns {boolean}
   */
  static validateNonBlankString(variable) {
    return CommonValidator.validateNonBlankStringArray([variable]);
  }

  /**
   * Is var not blank or null
   *
   * @param {array<string>} array
   *
   * @returns {boolean}
   */
  static validateNonBlankStringArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        const variable = array[index];
        if (
          CommonValidator.isVarNullOrUndefined(variable) ||
          !CommonValidator.validateString(variable) ||
          variable == ''
        ) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Is var true?
   *
   * @returns {boolean}
   */
   static isVarTrue(variable) {
    return variable === true || variable === 'true';
  }

  /**
   * Is var false?
   *
   * @returns {boolean}
   */
  static isVarFalse(variable) {
    return variable === false || variable === 'false';
  }

  /**
   * Is var integer?
   *
   * @returns {boolean}
   */
  static validateInteger(variable) {
    try {
      const variableInBn = new BigNumber(String(variable));
      // Variable is integer and its length is less than 37 digits
      if (variableInBn.isInteger() && variableInBn.toString(10).length <= 37) {
        return true;
      }
    } catch (e) {}

    return false;
  }

  /**
   * Is var float?
   *
   * @returns {boolean}
   */
  static validateFloat(variable) {
    try {
      const variableInBn = new BigNumber(String(variable));
      // Variable is float and its length is less than 37 digits
      if (!variableInBn.isNaN() && variableInBn.toString(10).length <= 37) {
        return true;
      }
    } catch (e) {}

    return false;
  }

  /**
   * Is integer non zero?
   *
   * @param {string/number} variable
   *
   * @returns {boolean}
   */
  static validateNonZeroInteger(variable) {
    const oThis = this;

    if (oThis.validateInteger(variable)) {
      return Number(variable) > 0;
    }

    return false;
  }

  /**
   * Is float non zero?
   *
   * @param {string/number} variable
   *
   * @returns {boolean}
   */
  static validateNonZeroFloat(variable) {
    const oThis = this;

    if (oThis.validateFloat(variable)) {
      return Number(variable) > 0;
    }

    return false;
  }

  /**
   * Is string valid ?
   *
   * @returns {boolean}
   */
  static validateString(variable) {
    return typeof variable === 'string';
  }

  /**
   * Is var a string containing only alphabets?
   *
   * @param {string} string
   * @param {number} requiredLength
   *
   * @returns {boolean}
   */
   static validateStringLength(string, requiredLength) {
    const trimmedString = string.trim();
    const decodedString = decode(trimmedString);

    return decodedString.length <= requiredLength;
  }

  /**
   * Validate allowed characters in channel name.
   *
   * @param {string} string
   *
   * @returns {boolean}
   */
  static validateNameAllowedCharacters(string) {
    if (CommonValidator.validateNonEmptyString(string)) {
      const trimmedString = string.trim();
      const decodedString = decode(trimmedString);

      return /^[^{}%]+$/i.test(decodedString);
    }

    return false;
  }

  /**
   * Validate allowed characters in channel name.
   *
   * @param {string} string
   *
   * @returns {boolean}
   */
  static validateUserNameAllowedCharacters(string) {
    if (CommonValidator.validateNonEmptyString(string)) {
      const trimmedString = string.trim();

      return /^[a-z0-9\_\-]+$/i.test(trimmedString);
    }

    return false;
  }

  /**
   * Is valid Boolean number?
   *
   * @returns {boolean}
   */
   static validateBooleanFlag(bool) {
    const oThis = this;

    if (oThis.isVarNullOrUndefined(bool)) {
      return false;
    }

    return bool === 1 || bool === 0 || bool === '1' || bool === '0';
  }

  /**
   * Is valid one value?
   *
   * @returns {boolean}
   */
   static validateTruthyBoolean(bool) {
    const oThis = this;

    if (oThis.isVarNullOrUndefined(bool)) {
      return false;
    }

    return bool === 1 || bool === '1';
  }

  /**
   * Is var a string containing alpha numeric chars?
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
   static validateAlphaNumericString(variable) {
    if (CommonValidator.isVarNullOrUndefined(variable)) {
      return false;
    }

    return /^[a-z0-9]+$/i.test(variable);
  }

  /**
   * Is valid integer array?
   *
   * @param {array} array
   *
   * @returns {boolean}
   */
   static validateIntegerArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateInteger(array[index])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Is valid non zero integer array?
   *
   * @param {array} array
   *
   * @returns {boolean}
   */
   static validateNonZeroIntegerArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateNonZeroInteger(array[index])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Validate and sanitize non zero integer array
   *
   * @param {array} array
   *
   * @returns {boolean}
   */
  static validateAndSanitizeNonZeroIntegerArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        const arrayElement = array[index];

        if (!CommonValidator.validateNonZeroInteger(arrayElement)) {
          return false;
        }

        array[index] = Number(arrayElement);
      }

      return true;
    }

    return false;
  }

  /**
   * Validate alpha numeric string array.
   *
   * @param {array} array
   *
   * @return {boolean}
   */
  static validateAlphaNumericStringArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateAlphaNumericString(array[index])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   *  Is valid array?
   *
   *  @param {array} array
   *
   *  @returns {boolean}
   */
   static validateArray(array) {
    return Array.isArray(array);
  }

  /**
   *  Is valid non-empty array?
   *
   *  @param {array} array
   *
   *  @returns {boolean}
   */
  static validateNonEmptyArray(array) {
    return Array.isArray(array) && array.length > 0;
  }

  /**
   *  Is valid non-empty string array?
   *
   *  @param {array} array
   *
   *  @returns {boolean}
   */
  static validateNonEmptyStringArray(array) {
    const oThis = this;

    if (oThis.validateNonEmptyArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (typeof array[index] !== 'string') {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Check if variable is object and non-empty.
   *
   * @param {object} variable
   *
   * @returns {boolean}
   */
   static validateNonEmptyObject(variable) {
    if (CommonValidator.isVarNullOrUndefined(variable) || typeof variable !== 'object') {
      return false;
    }

    for (const prop in variable) {
      try {
        if (Object.prototype.hasOwnProperty.call(variable, prop)) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }

    return false;
  }

  /**
   * Validate hash array.
   *
   * @param {array<string>} array
   *
   * @returns {boolean}
   */
  static validateNonEmptyObjectArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateNonEmptyObject(array[index])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Validate object.
   *
   * @param {object} variable
   *
   * @returns {boolean}
   */
  static validateObject(variable) {
    return !(CommonValidator.isVarNullOrUndefined(variable) || typeof variable !== 'object');
  }

  /**
   * Validate API validateTransactionStatusArray
   *
   * @param {array<string>} array
   *
   * @returns {boolean}
   */
  static validateStringArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateString(array[index])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Validate non-empty string.
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
   static validateNonEmptyString(variable) {
    return !!(CommonValidator.validateString(variable) && variable && variable.trim().length !== 0);
  }

  /**
   * Validates null or string.
   *
   * @param string
   * @returns {boolean}
   */
   static validateNullString(string) {
    if (CommonValidator.isVarNull(string)) {
      return true;
    }

    return CommonValidator.validateString(string);
  }

  /**
   * Is variable number?
   *
   * @param {number} variable
   *
   * @returns {boolean}
   */
   static validateNumber(variable) {
    try {
      if (typeof variable !== 'string' && typeof variable !== 'number') {
        return false;
      }

      const variableInBn = new BigNumber(String(variable));
      // Variable is number and its length is less than 37 digits
      if (!variableInBn.isNaN() && variableInBn.toString(10).length <= 37) {
        return true;
      }
    } catch (err) {
      console.error(err);
    }

    return false;
  }

  /**
   * Validate if
   *
   * @param {Number} num
   *
   * @returns {boolean}
   */
   static isNumberWithTwoDecimals(num) {
    if (!CommonValidator.validateNumber(num)) {
      return false;
    }

    const arr = num.toString().split('.');

    if (arr.length === 1) {
      return true;
    }

    return arr[arr.length - 1].length <= 2;
  }
}

module.exports = CommonValidator;
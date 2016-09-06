/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/cpp-class
*/

/**
 * @file It contains some [utility functions]{@link utils}.
 *
 * @author Valerii Zinchenko
 *
 * @version 1.1.0
 */

'use strict';

/**
 * Utility functions.
 * @namespace
 */
var utils = {
    /**
     * Make deep object copy.
     * If some object property is already exist in target object - it will be replaced
     * by the property from source object.
     *
     * @param {Object} target - Target object.
     * @param {Object} source - Source object.
     * @returns {Object} Target object.
     */
    deepCopy: function(target, source) {
        var key,
            value;

        for (key in source) {
            value = source[key];
            switch (Object.prototype.toString.call(value)) {
                case '[object Object]':
                    if (!target[key]) {
                        target[key] = {};
                    }
                    utils.deepCopy(target[key], value);
                    break;
                default :
                    target[key] = value
            }
        }

        return target;
    },

    /**
     * Extend object deeply.
     * Extend the target object with missed properties from source object.
     *
     * @param {Object} target - Target object.
     * @param {Object} source - Source object.
     * @returns {Object} Target object.
     */
    deepExtend: function(target, source) {
        var key,
            value;

        for (key in source) {
            value = source[key];
            if (target.hasOwnProperty(key)) {
                if (typeof target[key] === 'object') {
                    utils.deepExtend(target[key], value);
                }
                continue;
            }

            switch (Object.prototype.toString.call(value)) {
                case '[object Object]':
					target[key] = {};
                    utils.deepExtend(target[key], value);
                    break;
                case '[object Array]':
                    target[key] = value.map(function(el) { return el; });
                    break;
                default :
                    target[key] = value;
            }
        }

        return target;
    },

    /**
     * Convert Date object into plain date string.
     * Conversion steps:
     * 1. Call 'toISOString()' which converts the date into following format: 'YYYY-MM-DDTHH:MM:SS.MMMZ'
     * 2. Make time and timezone offset invariant: 'YYYY-MM-DD'
     *
     * @param {Date} [dateObj] - Date object. If omitted 'new Date()' will be converted.
     * @returns {string} 'YYYY-MM-DD'
     */
    date: function(dateObj) {
        if (!dateObj) {
            dateObj = new Date();
        } else if (dateObj.constructor !== Date) {
            throw new Error('Incorrect input argument type');
        }

        // Remove timezone influence by calling tiISOString().
        dateObj.setTime(dateObj.getTime() - dateObj.getTimezoneOffset()*60000); // Convert minutes in milliseconds: 60000 = 60*10000

        return dateObj.toISOString().slice(0,10);
    },

	/**
	 * Get the type of the data
	 *
	 * @param {*} data - Data what will be discovered
	 * @return {String} - Type of the data
	 */
	whatIs: function(data) {
		return Object.prototype.toString.call(data);
	},

	/**
	 * Check the specific type of an input argument.
	 *
	 * @param {*} data - Argument that will be checked.
	 * @param {String} type - Expected type name, like Object, Array etc.
	 * @return {boolean}
	 */
	is: function(data, type) {
		return this.whatIs(data) === '[object ' + type + ']';
	},

	/**
	 * Check if input argument is Object.
	 *
	 * @param {*} data - Argument that will be checked.
	 * @return {boolean}
	 */
	isObject: function(data) {
		return this.is(data, 'Object');
	},

	/**
	 * Check if input argument is Array.
	 *
	 * @param {*} data - Argument that will be checked.
	 * @return {boolean}
	 */
	isArray: function(data) {
		return this.is(data, 'Array');
	},

	/**
	 * Check if input argument is String.
	 *
	 * @param {*} data - Argument that will be checked.
	 * @return {boolean}
	 */
	isString: function(data) {
		return this.is(data, 'String');
	},

	/**
	 * Check if object is empty, i.e. doesn't have any property and methods.
	 *
	 * @param {Object} object - Object that will be checked.
	 * @return {boolean}
	 */
	isObjectEmpty: function(object) {
		return Object.keys(object).length === 0;
	},

	/**
	 * Compare two version.
	 *
	 * @param {String} v1 - Version relative what the decition will be accepted.
	 * @param {String} v2 - Version which will be compared.
	 * @return {Number} -1: if v1 is lower than v2; 0: if v1 is the same as v2; 1: if v1 is greater than v2
	 */
	compareVersions: function(v1, v2) {
		v1 = v1.split('.').map(function(str) {return parseInt(str, 10);});
		v2 = v2.split('.').map(function(str) {return parseInt(str, 10);});

		for (var n = 0, N = v1.length; n < N; n++) {
			if (v1[n] > v2[n]) {
				return 1;
			} else if (v1[n] < v2[n]) {
				return -1;
			}
		}

		return 0;
	}
};

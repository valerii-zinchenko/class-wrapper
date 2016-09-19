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
	 * Encapsulate methods and properties from 'what' object or Class into 'to' Class.
	 *
	 * @param {Object | Class} what - Object or Class that will be encapsulated.
	 * @param {Class} to - Class where the methods and properties will be encapsulated.
	 */
	encapsulate: function (what, to) {
		if (Object.prototype.toString.call(what) == '[object Function]') {
			what = what.prototype;
		}

		for (var key in what) {
			// Note. 'constructor' is excluded to not override the real class constructor.
			if (what.hasOwnProperty(key) && key != 'constructor') {
				var value = what[key];
				switch (Object.prototype.toString.call(value)) {
					// Store functions into "prototype"
					case '[object Function]':
						to.prototype[key] = value;
						break;

					// Clone objects and store the copies into "_defaults"
					case '[object Object]':
						if (key === '_defaults') {
							// NOTE. This is only for cases when some instance of ClassBuilder will be encapsulated.
							utils.deepCopy(to.prototype._defaults, value);
						} else {
							if (!to.prototype._defaults[key]) {
								to.prototype._defaults[key] = {};
							}
							utils.deepCopy(to.prototype._defaults[key], value);
						}
						break;

					// Store evererything else into "_defaults" container
					default:
						to.prototype._defaults[key] = value;
				}
			}
		}
	}
};

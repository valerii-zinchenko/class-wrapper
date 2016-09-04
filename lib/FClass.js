/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014-2015  Valerii Zinchenko

 This file is part of TaskOnFly.

 TaskOnFly is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 TaskOnFly is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with TaskOnFly.  If not, see <http://www.gnu.org/licenses/>.


 All source files are available at: http://github.com/valerii-zinchenko/TaskOnFly
*/

/**
 * @file It contains the implementation of [FClass]{@link FClass}
 *
 * @see {@link Class}
 * @see {@link SingletonClass}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0.1
 */

'use strict';

/**
 * Main class factory.
 * It takes the function that will be used as class constructor and wraps it in order to automate constructor creation.
 * With this class factory it is possible to create an usual well known class as in C++ programming language.
 *
 * The new created class constructor will have the reference to the parent class (in 'parent' property), inherited methods and merged '_default' property object.
 *
 * @constructor
 * @param {Function} Constructor - Main class constructor subroutine.
 * @returns {ClassConstructor} Class constructor.
 *
 * @throws {Error} Incorrect input arguments. Constructor function is not defined
 * @throws {Error} Constructor should be an function
 *
 * @see {@link Class}
 * @see {@link SingletonClass}
 */
function FClass(Constructor) {
    if (arguments.length != 1) {
        throw new Error('Incorrect input arguments. Constructor function is not defined');
    }
    if (typeof Constructor !== 'function') {
        throw new Error('Constructor should be an function');
    }

	/**
	 * Encapsulate methods and properties from 'what' object or Class into 'to' Class.
	 *
	 * @param {Object | Class} what - Object or Class that will be encapsulated.
	 * @param {Class} to - Class where the methods and properties will be encapsulated.
	 */
	function encapsulate(what, to) {
		if (Object.prototype.toString.call(what) == '[object Function]') {
			what = what.prototype;
		}

		for (var key in what) {
			// Note. 'constructor' is excluded in order to not override the real class constructor.
			if (what.hasOwnProperty(key) && key != 'constructor') {
				var value = what[key];
				switch (Object.prototype.toString.call(value)) {
					case '[object Function]':
						to.prototype[key] = value;
						break;

					case '[object Object]':
						if (key == '_defaults') {
							// NOTE. This is only for cases when some instance of FClass will be encapsulated.
							utils.deepCopy(to.prototype._defaults, value);
						} else {
							if (!to.prototype._defaults[key]) {
								to.prototype._defaults[key] = {};
							}
							utils.deepCopy(to.prototype._defaults[key], value);
						}
						break;

					default:
						to.prototype._defaults[key] = value;
				}
			}
		}
	}

    /**
     * Class constructor subroutine.
     *
     * @note This is just for documentation.
     *
     * @name ClassConstructor
     * @constructor
     * @param {ClassConstructor} [Parent = Object] - Parent class. Built-in 'Object' will be used if this argument will be omitted
	 * @param {ClassConstructor | Object} [...rest] - Classes/objects properties and methods of which will be encapsulated
     * @param {Object} props - The last input argument. Defines the properties and methods for a new class
     * @returns {Function} Instance
	 *
	 * @throws {Error} Incorrect input arguments. It should be: new Class([Function], [Function | Object]*, Object)
     */
    return function(Parent, props){
        var Class, CoreClass;

        // Last input argument is an object of Class properties
		props = arguments[arguments.length - 1];
        if (!props || props && (typeof props !== 'object')) {
            throw new Error('Incorrect input arguments. It should be: new Class([Function], [Function | Object]*, Object)');
        }
		if (Parent == props) {
			Parent = Object;
		}

        // Create proxy function
        CoreClass = function(){};
        CoreClass.prototype = Parent.prototype;

        // Clone class constructor function
        eval('Class = ' + Constructor.toString());
        // Setup class constructor function
        Class.prototype = new CoreClass();
        Class.parent = Parent.prototype;
        Class.prototype.constructor = Class;

        Class.prototype._defaults = {};
        // Clone default properties from parent class
        if (Class.parent._defaults) {
            utils.deepCopy(Class.prototype._defaults, Class.parent._defaults);
        }

		// Prepare an array of being encapsulated classes and objects.
		var encapsulations = Array.prototype.slice.call(arguments, 1, -1);
		if (props.Encapsulate) {
			if (Object.prototype.toString.call(props.Encapsulate) == '[object Array]') {
				encapsulations = encapsulations.concat(props.Encapsulate);
			} else {
				encapsulations.push(props.Encapsulate);
			}

			delete props.Encapsulate;
		}
		encapsulations.push(props);

		// Setup input properties to the new class
		// Encapsulate methods and properties from other classes/objects
		for (var n = 0, N = encapsulations.length; n < N; n++) {
			encapsulate(encapsulations[n], Class);
		}

        return Class;
    }
}

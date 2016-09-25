/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/class-wrapper
*/

/**
 * @file Implementation of a C++-like [class]{@link Class}
 *
 * @see {@link ClassBuilder}
 * @see {@link SingletonClass}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.1.2
 */

'use strict';

/**
 * Core class constructor wrapper.
 * This constructor function simulates the behavior of a constructor from C++ () - all parent constructors are executing first, starting from the root parent constructor and finishing with the constructor for the new class.
 * Before the constructor's chain will be executed the new instance will be extended by "_default" properties.
 */
function CoreConstructor() {
	// Extend this.__defaults from a __defaults of a constructor's prototype because, this.__defaults is searching through the whole prototype chain
	utils.deepExtend(this, this.constructor.prototype.__defaults);

	// Recursively call all parent's constructors, started from the top parent class
	(function constructParentStack(context, child, args) {
		var parent = child.constructor.__parent;
		// dive to the top most root parent
		if (parent) {
			constructParentStack(context, parent, args);
		}

		// execute parent's specific constructor if it explicitly defined
		if (child.hasOwnProperty('__constructor')) {
			child.__constructor.apply(context, args);
		}
	})(this, this.constructor.__parent, arguments);

	// Call constructor function of a new class
	// It is checking the __constructor from a constructor's prototype, because this.__constructor is searching throug the whole prototype chain
	if (this.constructor.prototype.hasOwnProperty('__constructor')) {
		this.constructor.prototype.__constructor.apply(this, arguments);
	}
}

/**
 * Class
 * This binds {@link CoreConstructor} function into ClassBuilder function as the first argument, so it will accept the other arguments.
 *
 * @see {@link ClassBuilder}
 *
 * @param {Function} [Parent = Object] - Parent class. Built-in 'Object' will be used if this argument will be omitted
 * @param {Function | Object} [...rest] - Classes/function's/object's properties and methods of which will be encapsulated
 * @param {Function | null} Constructor - Class constructor
 * @param {Object} props - The last input argument. Defines the properties and methods for a new class
 * @param {Object | Array} [props.Encapsulate] - Define which object or an array of objects should be encapsulated into the new class
 * @returns {Function} Class constructor
 */
var Class = ClassBuilder.bind(null, CoreConstructor);

/*
new Class({
    private: {

    },
    protected: {

    },
    public: {

    }
});
*/

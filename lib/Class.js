/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/cpp-class
*/

/**
 * @file Implementation of a C++-like [class]{@link Class}
 *
 * @see {@link FClass}
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
	utils.deepExtend(this, this.constructor.prototype._defaults);

	// Recursively call all parent's constructors, started from the top parent class
	(function constructParentStack(context, child, args) {
		var parent = child.constructor.parent;
		// dive to the root parent
		if (parent) {
			constructParentStack(context, parent, args);
		}

		// execute parent's specific constructor if it explicitly defined
		if (child.hasOwnProperty('initialize')) {
			child.initialize.apply(context, args);
		}
	})(this, this.constructor.parent, arguments);

	// Call constructur function of a new class if it was explicitly defined
	// If it was not defined then the parent's constructor were already execited
	if (this.constructor.prototype.hasOwnProperty('initialize')) {
		this.constructor.prototype.initialize.apply(this, arguments);
	}
}

/**
 * Class
 * This binds {@link Coreconstructor} function into FClass function as the first argument, so it will accept the other arguments.
 *
 * @see {@link FClass}
 *
 * @param {Function} [Parent = Object] - Parent class. Built-in 'Object' will be used if this argument will be omitted
 * @param {Function | Object} [...rest] - Classes/function's/object's properties and methods of which will be encapsulated
 * @param {Object} props - The last input argument. Defines the properties and methods for a new class
 * @param {Object | Array} [props.Encapsulate] - Define which object or an array of objects should be encapsulated into the new class
 * @returns {Function} Class constructor
 */
var Class = FClass.bind(null, CoreConstructor);

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

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
 * Execute a parent's constructor before the current constructor.
 * The behavior of this builder is similar to C++ - all parent constructors are executing first, starting from the root parent constructor and finishing with the constructor of a new class.
 * Before the constructor's chain will be executed the new instance will be extended by "__defaults" properties.
 */
function ParentConstructorFirst() {
	// Extend this.__defaults from a __defaults of a constructor's prototype, because this.__defaults is searching through the whole prototype chain
	utils.deepExtend(this, this.constructor.prototype.__defaults);

	// Recursively call all parent's constructors, started from the top most parent node
	(function constructParentStack(context, child, args) {
		var parent = child.constructor.__parent;
		// dive to the root parent
		if (parent) {
			constructParentStack(context, parent, args);
		}

		// execute parent's constructor if it was defined
		if (child.hasOwnProperty('__constructor')) {
			child.__constructor.apply(context, args);
		}
	})(this, this.constructor.__parent, arguments);

	// Call constructor of a new class if ir is defined
	// It is checking the __constructor from a constructor's prototype, because this.__constructor is searching throug the whole prototype chain
	if (this.constructor.prototype.hasOwnProperty('__constructor')) {
		this.constructor.prototype.__constructor.apply(this, arguments);
	}
}

/**
 * Class
 * This binds {@link ParentConstructorFirst} function into ClassBuilder function as the first argument, so it will accept the other arguments.
 *
 * @param {Function | null} Constructor - Class constructor. The second last argument
 * @param {Object} props - Defines the properties and methods for a new class. The last input argument
 * @param {Object | Function | Class | Array} [props.Encapsulate] - Define which object/function/class or an array of classes/functions/objects should be encapsulated into the new class
 * @returns {Function} Class
 *
 * @throws {Error} Incorrect input arguments. It should be: ClassBuilder(Function, [Function], Function | null, Object)
 * @throws {Error} Some of the items for encapsulation is incorrect. An item can be: Object, Function, Class
 *
 * @see {@link ClassBuilder}
 */
var Class = ClassBuilder.bind(null, ParentConstructorFirst);

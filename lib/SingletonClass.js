/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/class-wrapper
*/

/**
 * @file Implementation of [singleton class]{@link SingletonClass}
 *
 * @see {@link ClassBuilder}
 * @see {@link Class}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.1.1
 */

'use strict';

/**
 * Singleton Class
 * This additionally wraps the {@link ParentConstructorFirst} to store and return already created instance.
 * This binds addtional wrapper into ClassBuilder function as the first argument, so it will accept the other arguments.
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
var SingletonClass = ClassBuilder.bind(null, function() {
	// Return instance if it is already exist
	if (this.constructor.instance) {
		return this.constructor.instance;
	}

	// Store new instance
	this.constructor.instance = this;

	ParentConstructorFirst.apply(this, arguments);
});

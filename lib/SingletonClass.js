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
 * This additionally wraps the {@link CoreConstructor} to store and return already created instance.
 * This binds addtional wrapper into ClassBuilder function as the first argument, so it will accept the other arguments.
 *
 * @see {@link ClassBuilder}
 *
 * @param {Function} [Parent = Object] - Parent class. Built-in 'Object' will be used if this argument will be omitted
 * @param {Function | Object} [...rest] - Classes/function's/object's properties and methods of which will be encapsulated
 * @param {Object} props - The last input argument. Defines the properties and methods for a new class
 * @param {Object | Array} [props.Encapsulate] - Define which object or an array of objects should be encapsulated into the new class
 * @returns {Function} Class constructor
 */
var SingletonClass = ClassBuilder.bind(null, function() {
	// Return instance if it is already exist
	if (this.constructor.instance) {
		return this.constructor.instance;
	}

	// Store new instance
	this.constructor.instance = this;

	CoreConstructor.apply(this, arguments);
});

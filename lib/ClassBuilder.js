/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/cpp-class
*/

/**
 * @file Implementation of [ClassBuilder]{@link ClassBuilder}
 *
 * @see {@link Class}
 * @see {@link SingletonClass}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0.2
 */

'use strict';

/**
 * Main class builder.
 * It takes the constructor function and wraps it to add few automated processes for constructing a new class.
 *
 * Properties and features:
 * - set the parent class
 * - save the inheritance chain
 * - define the classes/functions/objects that are going to be encapsulated into the resulting class. The last encapsulated object will have a precndence over the previose objects, even parent class. Only the own properties of the new class will have the highest precedence
 * - the reference to the parent class is stored in 'parent' property
 * - inherited methods are stored in class prototype object
 * - store default class properties in '_default' object where the objects will be copied, not shared
 *
 * @param {Function} Constructor - Main class constructor subroutine.
 * @param {Function} [Parent = Object] - Parent class. Built-in 'Object' will be used if this argument will be omitted
 * @param {Function | Object} [...rest] - Classes/function's/object's properties and methods of which will be encapsulated
 * @param {Object} props - The last input argument. Defines the properties and methods for a new class
 * @param {Object | Array} [props.Encapsulate] - Define which object or an array of objects should be encapsulated into the new class
 * @returns {Function} Class constructor
 *
 * @throws {Error} Incorrect input arguments. It should be: ClassBuilder(Function, [Function], [Function | Object]*, Object)
 *
 * @see {@link Class}
 * @see {@link SingletonClass}
 */
function ClassBuilder(Constructor, Parent, props) {
	// Last input argument is an object of properties for a new class
	props = arguments[arguments.length - 1];

	// Set default Parent class if it is not provided
	if (Parent == props) {
		Parent = Object;
	}

	// An array of an classes, functions and objects properties and methods of which will be incapsulated into a new class
	var encapsulations = Array.prototype.slice.call(arguments, 2, -1);


	// Validate input arguments
	// --------------------------------------------------
	if (arguments.length < 2
		|| typeof Constructor !== 'function'
		|| Object.prototype.toString.call(Parent) !== '[object Function]'
		|| Object.prototype.toString.call(props) !== '[object Object]'
		|| encapsulations.some(function(item) {
				var type = Object.prototype.toString.call(item);
				return type !== '[object Function]' && type !== '[object Object]';
			}))
	{
		throw new Error('Incorrect input arguments. It should be: ClassBuilder(Function, [Function], [Function | Object]*, Object)');
	}
	// todo: Validate proprties for a usage of reserverd locally variable names to avoid the interference
	// --------------------------------------------------


	// Clone class constructor function
	// --------------------------------------------------
	var Class;
	eval('Class = ' + Constructor.toString());
	// Create reference to a parent's prototype object for internal usage
	Class.parent = Parent.prototype;
	// --------------------------------------------------


	// Inheritance chain
	// --------------------------------------------------
	// Create proxy prototype, in order to not change the parent's prototype
	var CoreClass = function(){};
	CoreClass.prototype = Parent.prototype;
	Class.prototype = new CoreClass();
	// Revert back the reseted reference to the constructor function
	Class.prototype.constructor = Class;

	// Create storage for a default properties
	Class.prototype._defaults = {};
	// --------------------------------------------------


	// Encapsulate properties and methods of provided objects
	// --------------------------------------------------
	// Collect objects properties and methods of which will be encapsulated into a new class
	if (props.Encapsulate) {
		if (Object.prototype.toString.call(props.Encapsulate) == '[object Array]') {
			encapsulations = encapsulations.concat(props.Encapsulate);
		} else {
			encapsulations.push(props.Encapsulate);
		}

		// Remove "Encapsulate" property, because it is not need to be encapsulated
		delete props.Encapsulate;
	}
	// Put parent's defaults into an encapsulation chain
	if (Parent.prototype._defaults) {
		encapsulations.unshift(Parent.prototype._defaults);
	}
	// Put properties and methods of a new clas into the encapsilation chain
	encapsulations.push(props);

	// Setup input properties to the new class
	// Encapsulate methods and properties from other classes/objects
	for (var n = 0, N = encapsulations.length; n < N; n++) {
		utils.encapsulate(encapsulations[n], Class);
	}
	// --------------------------------------------------


	return Class;
}


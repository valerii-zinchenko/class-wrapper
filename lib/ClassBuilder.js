/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/class-wrapper
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
 * Property names that are used internally and will be ignored in any encapsulated object:
 * - __constructor
 * - __parent
 *
 * If some of the object has "__defaults" object, then all it's properties will be treated as usual object of default properties that a new class should have.
 *
 * @param {Function} InstanceBuilder - Function that defines how instances will be created, how constructor(s) will be executed.
 * @param {Function} [Parent = Object] - Parent class. Built-in 'Object' will be used if this argument will be omitted
 * @param {Function | Object} [...rest] - Classes/function's/object's properties and methods of which will be encapsulated
 * @param {Function | null} Constructor - Class constructor
 * @param {Object} props - The last input argument. Defines the properties and methods for a new class
 * @param {Object | Array} [props.Encapsulate] - Define which object or an array of classes/functions/objects should be encapsulated into the new class
 * @returns {Function} Class constructor
 *
 * @throws {Error} Incorrect input arguments. It should be: ClassBuilder(Function, [Function], [Function | Object]*, Function | null, Object)
 *
 * @see {@link Class}
 * @see {@link SingletonClass}
 */
function ClassBuilder(InstanceBuilder, Parent, Constructor, props) {
	// Last input argument is an object of properties for a new class
	props = arguments[arguments.length - 1];

	// Second last input argument is a constructor function
	Constructor = arguments[arguments.length - 2];

	// Set default Parent class if it is not provided
	if (arguments.length === 3) {
		Parent = Object;
	}

	// An array of classes, functions and objects which will be encapsulated into a new class
	var encapsulations = Array.prototype.slice.call(arguments, 2, -2);


	// Validate input arguments
	// --------------------------------------------------
	if (arguments.length < 3
		|| typeof InstanceBuilder !== 'function'
		|| Object.prototype.toString.call(Parent) !== '[object Function]'
		|| (Constructor !== null && typeof Constructor !== 'function')
		|| Object.prototype.toString.call(props) !== '[object Object]'
		|| encapsulations.some(function(item) {
				var type = Object.prototype.toString.call(item);
				return type !== '[object Function]' && type !== '[object Object]';
			}))
	{
		throw new Error('Incorrect input arguments. It should be: ClassBuilder(Function, [Function], [Function | Object]*, Function | null, Object)');
	}
	// --------------------------------------------------



	// Clone class constructor function to prevent a sharing of instance builder function
	// --------------------------------------------------
	var Class;
	eval('Class = ' + InstanceBuilder.toString());
	// --------------------------------------------------


	// Inheritance chain
	// --------------------------------------------------
	// Derive a new class from a Parent class
	Class.prototype = Object.create(Parent.prototype);
	// Revert back the reference to the instance builder function
	Class.prototype.constructor = Class;

	// Store the reference to the constructor function
	if (Constructor) {
		Class.prototype.__constructor = Constructor;
	}
	// Create a storage for default properties
	Class.prototype.__defaults = {};

	// Store a reference to a parent's prototype object for internal usage
	Class.__parent = Parent.prototype;
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
	if (Parent.prototype.__defaults) {
		encapsulations.unshift(Parent.prototype.__defaults);
	}
	// Put properties and methods of a new class into the encapsulation chain
	encapsulations.push(props);

	// Setup input properties to the new class
	// Encapsulate methods and properties from other classes/objects
	for (var n = 0, N = encapsulations.length; n < N; n++) {
		utils.encapsulate(encapsulations[n], Class);
	}
	// --------------------------------------------------


	return Class;
}


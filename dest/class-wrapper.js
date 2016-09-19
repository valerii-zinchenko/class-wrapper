(function (root, factory) {
	if(typeof define === "function" && define.amd) {
		define([], factory);
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory();
	} else {
		root.classWrappers = factory();
	}
})(this, function() {
// Set of wrappers for easier creation of different kinds of classes
// v0.9.1
// Copyright (c) 2016  Valerii Zinchenko
// License: http://valerii-zinchenko.github.io/class-wrapper/LICENSE.txt
// All source files are available at: http://github.com/valerii-zinchenko/class-wrapper
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


/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/cpp-class
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
 * This binds {@link Coreconstructor} function into ClassBuilder function as the first argument, so it will accept the other arguments.
 *
 * @see {@link ClassBuilder}
 *
 * @param {Function} [Parent = Object] - Parent class. Built-in 'Object' will be used if this argument will be omitted
 * @param {Function | Object} [...rest] - Classes/function's/object's properties and methods of which will be encapsulated
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

/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/cpp-class
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

	return {
		utils: utils,
		ClassBuilder: ClassBuilder,
		Class: Class,
		SingletonClass: SingletonClass
	};
});
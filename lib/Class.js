/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/cpp-class
*/

/**
 * @file It contains the implementation of simple [class]{@link Class} creator.
 *
 * @see {@link FClass}
 * @see {@link SingletonClass}
 * @see {@link MVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.1.0
 */

'use strict';

/**
 * Main class constructor.
 * First it extends the current's class _default property.
 * Then it constructs a class: first call all parent's class constructors and then current constructor.
 */
function ClassConstructor() {
    utils.deepExtend(this, this.constructor.prototype._defaults);

	// Recursively call all parent's constructors, started from the top parent class
	(function constructParentStack(context, child, args) {
		var parent = child.constructor.parent;
		if (parent) {
			constructParentStack(context, parent, args);
		}

		if (child.hasOwnProperty('initialize')) {
			child.initialize.apply(context, args);
		}
	})(this, this.constructor.parent, arguments);

    if (this.constructor.prototype.hasOwnProperty('initialize')) {
        this.constructor.prototype.initialize.apply(this, arguments);
    }
}

/**
 * Simple Class creator function.
 * This creator subroutine calls first the parent
 * class constructor method ('initialize') and then the own class constructor method.
 *
 * @type {FClass}
 * @constructor
 * @param {ClassConstructor} [Parent = Object] - Parent class. Built-in 'Object' will be used if this argument will be omitted
 * @param {Object} props - Defines the properties and methods for new class
 * @returns {Function} Instance
 */
var Class = new FClass(function() {
    ClassConstructor.apply(this, arguments);
});

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

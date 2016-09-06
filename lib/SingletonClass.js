/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/cpp-class
*/

/**
 * @file It contains the implementation of [singleton class]{@link SingletonClass} creator.
 *
 * @see {@link FClass}
 * @see {@link Class}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.1.0
 */

'use strict';

/**
 * Singleton Class creator function.
 * This will create a singleton class.
 * This creator subroutine checks first if instance is already exist.
 * If not then it will call the parent class constructor method ('initialize'),
 * then the own class constructor method and store the instance.
 * If the instance is already exist it will be returned.
 *
 * @type {FClass}
 * @constructor
 * @param {ClassConstructor} [Parent = Object] - Parent class. Built-in 'Object' will be used if this argument will be omitted
 * @param {Object} props - Defines the properties and methods for new class
 * @returns {Function} Instance
 */
var SingletonClass = new FClass(function() {
    if (this.constructor.instance) {
        return this.constructor.instance;
    }
    this.constructor.instance = this;

    ClassConstructor.apply(this, arguments);

    return this.constructor.instance;
});

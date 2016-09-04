/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014-2015  Valerii Zinchenko

 This file is part of TaskOnFly.

 TaskOnFly is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 TaskOnFly is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with TaskOnFly.  If not, see <http://www.gnu.org/licenses/>.


 All source files are available at: http://github.com/valerii-zinchenko/TaskOnFly
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

/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/cpp-class
*/

'use strict';

suite('FClass', function() {
	suite('Input arguments', function() {
		test('No arguments', function() {
			assert.throw(function() {
				new FClass();
			}, Error, 'Incorrect input arguments. Constructor function is not defined');
		});
		test('Incorrect type of input argument', function(){
			assert.throw(function() {
				new FClass(2);
			}, Error, 'Constructor should be an function');
		});
		test('Correct input arguments', function() {
			assert.doesNotThrow(function() {
				new FClass(function() {});
			});
		});
	});

	suite('Test returned class constructor', function() {
		var SomeClassBuilder;
		setup(function() {
			SomeClassBuilder = new FClass(function(){});
		});
		teardown(function(){
			SomeClassBuilder = null;
		});

		test('Create new class without any properties and methods', function(){
			assert.throw(function(){
				new (new SomeClassBuilder())();
			}, Error, 'Incorrect input arguments. It should be: new Class([Function], [Function | Object]*, Object)');
		});
		test('Incorrect input argument(s)', function() {
			assert.throw(function() {
				new SomeClassBuilder(Object);
			}, Error, 'Incorrect input arguments. It should be: new Class([Function], [Function | Object]*, Object)');
			assert.throw(function() {
				new SomeClassBuilder(11);
			}, Error, 'Incorrect input arguments. It should be: new Class([Function], [Function | Object]*, Object)');
			assert.throw(function() {
				new SomeClassBuilder(Object, 11);
			}, Error, 'Incorrect input arguments. It should be: new Class([Function], [Function | Object]*, Object)');
		});
		test('Correct input argument(s)', function() {
			assert.doesNotThrow(function() {
				new SomeClassBuilder({});
			});
			assert.doesNotThrow(function() {
				new SomeClassBuilder(Object, {});
			});
		});

		test('Test types and values of the properties', function() {
			var obj = new (new SomeClassBuilder({
				number: 1,
				string: ':)',
				bool: true,
				nullValue: null,
				array: [0,1],
				obj: {
					v: 11
				},
				fn: function() {return this.number;}
			}))();

			assert.isNumber(obj._defaults.number, 'Number type was not saved');
			assert.isString(obj._defaults.string, 'String type was not saved');
			assert.isBoolean(obj._defaults.bool, 'Boolean type was not saved');
			assert.isNull(obj._defaults.nullValue, 'Null type was not saved');
			assert.isArray(obj._defaults.array, 'Array type was not saved');
			assert.isObject(obj._defaults.obj, 'Object type was not saved');
			assert.isFunction(obj.fn, 'Function type was not saved');

			assert.equal(obj._defaults.number, 1);
			assert.equal(obj._defaults.string, ':)');
			assert.equal(obj._defaults.bool, true);
			assert.isTrue(obj._defaults.array[0] === 0 && obj._defaults.array[1] === 1);
			assert.equal(obj._defaults.obj.v, 11);
		});

		suite('Encapsulation', function(){
			test('encapsulate some class into new one', function(){
				var SomeClass = new SomeClassBuilder({
					prop: 'property',
					object: {
						objprop: 'objprop'
					},
					method: function(){}
				});
				var properties = {
					object: {
						someprop: 'someprop'
					}
				};

				var result;
				assert.doesNotThrow(function(){
					result = new (new SomeClassBuilder(Object, SomeClass, properties))();
				});

				assert.equal(result._defaults.prop, SomeClass.prototype._defaults.prop, 'Property of some class should be encapsulated into the new class');
				assert.equal(result.method, SomeClass.prototype.method, 'Method of some class should be encapsulated into the new class');
				assert.notEqual(result._defaults.object, SomeClass.prototype._defaults, 'Object properties should not be encapsulated over reference, the should be cloned in the new class');
				assert.equal(result._defaults.object.objprop, SomeClass.prototype._defaults.object.objprop, 'Object property was incorrectly cloned/extended into the new class');
				assert.equal(result._defaults.object.someprop, properties.object.someprop, 'Encapsulated object was incorreclt merged into the new class');
			});

			test('encapsulate an object/class over object property "Encapsulate"', function(){
				var properties = {
					prop: 'prop',
					Encapsulate: {
						prop2: 'prop2'
					}
				};

				var result;
				assert.doesNotThrow(function(){
					result = new (new SomeClassBuilder(properties));
				});

				assert.isDefined(result._defaults.prop2, 'Encapsulated object was not encapsulated into the new class');
				assert.isUndefined(result._defaults.Encapsulate, '"Encapsulate" property should not be encapsulated into the new class');
			});

			test('encapsulate array of objects/classes over object property "Encapsulate"', function(){
				var properties = {
					Encapsulate: [
						{
							prop: 'prop'
						},
						{
							prop2: 'prop2'
						}
					]
				};

				var result;
				assert.doesNotThrow(function(){
					result = new (new SomeClassBuilder(properties));
				});

				assert.isDefined(result._defaults.prop, 'First encapsulated object was not encapsulated into the new class');
				assert.isDefined(result._defaults.prop2, 'Second encapsulated object was not encapsulated into the new class');
				assert.isUndefined(result._defaults.Encapsulate, '"Encapsulate" property should not be encapsulated into the new class');
			});
		});
	});
});

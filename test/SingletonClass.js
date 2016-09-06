/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/cpp-class
*/


suite('SingletonClass', function() {
	test('initialize()', function() {
		assert.doesNotThrow(function() {
			new (new SingletonClass({}))();
		});
		assert.throw(function() {
			new (new SingletonClass({
				initialize: function() {
					throw 'OK';
				}
			}))();
		}, 'OK');
	});

	test('Check constructor', function() {
		var Obj = new SingletonClass({});
		assert.equal(Obj, (new Obj()).constructor);
	});

	test('SingletonClass class should behave as singleton', function() {
		var Obj = new SingletonClass({});
		assert.equal(new Obj(), new Obj());
	});

	test('Second calling of initialize() for Singleton object', function() {
		var Obj = new SingletonClass({
			initialize: function() {
				throw 'OK';
			}
		});

		assert.throw(function() {
			new Obj();
		}, 'OK');
		assert.doesNotThrow(function() {
			new Obj();
		})
	});

	test('Calling of parent initialize()', function() {
		var value = 11,
			k = 4;

		var Parent = new SingletonClass({
			initialize: function() {
				this.value = value;
			}
		});
		var Child = new SingletonClass(Parent, {
			initialize: function() {
				this.value *= k;
			}
		});

		assert.equal((new Child()).value, value*k);
	});
});

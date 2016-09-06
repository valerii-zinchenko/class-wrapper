/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/cpp-class
*/


suite('Class.', function() {
	test('initialize()', function() {
		var spy = sinon.spy();
		assert.doesNotThrow(function() {
			new (new Class({
				initialize: spy
			}))();
		});
		assert.isTrue(spy.calledOnce, 'initialize() should be called by creating new class instance');
	});

	test('Check constructor', function() {
		var Obj;
		assert.doesNotThrow(function(){
			Obj = new Class({});
		});
		assert.equal((new Obj()).constructor, Obj, 'Constructor function was incorrectly stored');
	});

	test('Class should not behave as singleton', function() {
		var Obj;
		assert.doesNotThrow(function(){
			Obj = new Class({});
		});
		assert.notEqual(new Obj(), new Obj(), 'Class should not behave as singleton');
	});

	test('Cloning of property', function() {
		var Obj;
		var obj1;
		var obj2;

		assert.doesNotThrow(function(){
			Obj = new Class({
				obj: {}
			});
			obj1 = new Obj(),
			obj2 = new Obj();
		});

		assert.notEqual(obj1.obj, obj2.obj, 'Object under property name "obj" should clonned');
	});

	suite('Inheritance.', function() {
		var Parent;
		var parentInitialize;
		var prop = 4;
		setup(function() {
			parentInitialize = sinon.spy();
			Parent = new Class({
				prop: prop,
				initialize: parentInitialize,
				parentFn: function(){}
			});
		});
		teardown(function() {
			parentInitialize = null;
			Parent = null;
		});

		test('Check constructor', function() {
			var Child;
			var instance;
			assert.doesNotThrow(function(){
				Child = new Class(Parent, {});
				instance = new Child();
			});

			assert.equal(instance.constructor, Child);
			assert.notEqual(instance.constructor, Parent);
		});
		test('Public property', function() {
			var Child;
			assert.doesNotThrow(function(){
				Child = new Class(Parent, {});
			});
			assert.equal((new Child()).prop, prop);
		});
		test('Calling of parent initialize()', function() {
			var childInitialize = sinon.spy();
			assert.doesNotThrow(function(){
				var Child = new Class(Parent, {
					initialize: childInitialize
				});

				new Child();
			});

			assert.isTrue(parentInitialize.calledOnce, 'Parent constructor was not executed');
			assert.isTrue(childInitialize.calledOnce, 'Child constructor was not executed');
			assert.isTrue(childInitialize.calledAfter(parentInitialize), 'Child\'s initialize() should be called after Parent\'s initialize()');
		});
		test('Calling of parent initialize() of parent class', function() {
			var childInitialize = sinon.spy();
			var grandChildInitialize = sinon.spy();
			assert.doesNotThrow(function(){
				var Child = new Class(Parent, {
					initialize: childInitialize
				});
				var Grandchild = new Class(Child, {
					initialize: grandChildInitialize
				});

				new Grandchild();
			});

			assert.isTrue(parentInitialize.calledOnce, 'Parent constructor was not executed');
			assert.isTrue(childInitialize.calledOnce, 'Child constructor was not executed');
			assert.isTrue(grandChildInitialize.calledOnce, 'Grand child constructor was not executed');
			assert.isTrue(childInitialize.calledAfter(parentInitialize), 'Child\'s initialize() should be called after Parent\'s initialize()');
			assert.isTrue(grandChildInitialize.calledAfter(childInitialize), 'Grand child\'s initialize() should be called after Child\'s initialize()');
		});
		test('Constructors with input arguments', function() {
			var object;
			var inputArgs = ['a', 'b'];
			assert.doesNotThrow(function(){
				var Child = new Class(Parent, {
					initialize: function(a) {
						this.a = a;
					}
				});
				var Grandchild = new Class(Child, {
					initialize: function(a, b) {
						this.b = b;
					}
				});
				object = new Grandchild(inputArgs[0], inputArgs[1]);
			});

			assert.equal(object.a, inputArgs[0], 'First input argument was not processed by constructor');
			assert.equal(object.b, inputArgs[1], 'Second input argument was not processed by constructor');
		});
		test('Parents methods', function() {
			var object;
			assert.doesNotThrow(function(){
				var Child = new Class(Parent, {
					initialize: function() {
						this.isChild = true;
					},
					childFn: function(){}
				});
				var Grandchild = new Class(Child, {
					initialize: function() {
						this.isGrundchild = true;
					},
					grandchildFn: function(){}
				});
				object = new Grandchild();
			});

			assert.isDefined(object.parentFn, 'Parent function was not copied');
			assert.isDefined(object.childFn, 'Child function was not copied');
			assert.isDefined(object.grandchildFn, 'Grandchild function was not copied');
		});
	});
});

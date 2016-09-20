/*
 Copyright (c) 2016  Valerii Zinchenko

 See the file LICENSE.txt for copying permission.

 All source files are available at: http://github.com/valerii-zinchenko/class-wrapper
*/


suite('SingletonClass', function() {
	test('creating an instance without any specified constructor', function(){
		assert.doesNotThrow(function(){
			new (SingletonClass({}));
		});
	});

	test('calling of specific constructor', function() {
		var spy = sinon.spy();
		assert.doesNotThrow(function() {
			new (SingletonClass({
				initialize: spy
			}))();
		});

		assert.isTrue(spy.calledOnce, 'initialize() is treated as a specific class constructor and it should be called by creating new class instance');
	});

	test('SingletonClass class should always produce the same instance', function() {
		var constructorFn = sinon.spy();
		var inst1;
		var inst2;

		assert.doesNotThrow(function(){
			var Obj = SingletonClass({
				initialize: constructorFn
			});

			inst1 = new Obj();
			inst2 = new Obj();
		});

		assert.equal(inst1, inst2, 'SingletonClass should always produce the same instance');
		assert.isTrue(constructorFn.calledOnce, 'ScingletonClass should call constructor only once, then it should return already created instance');
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

	test('Iheritance', function(){
		var GrandParentClass;
		var ParentClass;
		var ChildClass;

		var result;
		assert.doesNotThrow(function(){
			GrandParentClass = SingletonClass({});
			ParentClass = Class(GrandParentClass, {});
			ChildClass = Class(ParentClass, {});

			result = new ChildClass();
		});

		assert.instanceOf(result, ChildClass, 'Resulting instance should be an instance of ChildClass');
		assert.instanceOf(result, ParentClass, 'Resulting instance should be an instance of ParentClass, because ParentClass is a parent class of the ChildClass');
		assert.instanceOf(result, GrandParentClass, 'Resulting instance should be an instance of GrandParentClass, because GrandParentClass is a parent class of ParentClass and ParentClass is a parent class of ChildClass');
	});

	test('Instance independance', function(){
		var parentInst;
		var childInst;

		assert.doesNotThrow(function(){
			var Parent = SingletonClass({});
			var Child = SingletonClass(Parent, {});

			parentInst = new Parent();
			childInst = new Child();
		});

		assert.notEqual(childInst, parentInst, 'Instance from the parent class should not be shared by creating an instance from a child class');
	});
});

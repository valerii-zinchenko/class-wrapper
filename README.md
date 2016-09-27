# class-wrapper

Set of wrappers for easier creation of different kind of classes. Currently there are three kinds of wrappers:

* `ClassBuilder` - the main wrapper that realize the inheritance and data encapsulation. It requires a function that defines how the instances will be created. It returns the clone of defined instance builder function with special features and properties.
* `Class` - this has predefined wrapper instance builder function for `ClassBuilder`, that calls all parent's constructors first before calling the constructor of current class. For example there is `GrandParent` class, `Parent` class that is derived from `GrandParent` class and `Child` class that if derived from the `Parent` class. So when `new Child` will be called then the constructor of `GrandParent` class will be executed, then constructor from Parent class and finally the constructor of Child class.
* `SingletonClass` - this has predefined wrapper instance builder function for `ClassBuilder`, that by any `new` always returns the same instance. It uses the same constructing routine as `Class` to create the first instance.

Each wrapper accepts:
* the parent class from which a new class is going to be derived
* object of properties and methods for a new class

Defined class properties are treated as default values for a new instance and they are isolated between instances, i.e. if some class has an object in properties, then each instance will have its own copy of that default object. Only methods are shared.


## Requirements
* [Object.create](http://kangax.github.io/compat-table/es5/#test-Object.create)
* [Function.prototype.bind](http://caniuse.com/#feat=es5)
* [Array.prototype.forEach](http://caniuse.com/#feat=es5)

If this library is planned to be used in some legacy environment then please add required plyfills. Here is a good resource: https://github.com/es-shims/es5-shim


## Installation
Via [NPM (Node Package Manager)](https://github.com/npm/npm)
```
$ npm install class-wrapper --save
```

Available library files:

1. `dest/class-wrapper.js` - not minified library package
1. `dest/class-wrapper.min.js` - minified library package


## Simple usage examples

```js
// Define a Figure class:
var Figure = Class(function() {
	console.log('Figure::initialize()');
}, {
	// abstract function for a calculating a suqare of a figure
	calcSquare: function() {}
});

// Define Rectangle class derived from a Figure class:
var Rectangle = Class(Figure, function(width, height) {
	console.log('Rectangle::initialize()');

	this._width = width;
	this._height = height;
}, {
	_width: 0,
	_height: 0,

	
	// abstract function for a calculating a suqare of a figure
	calcSquare: function() {
		return this._width * this._height;
	}
});

// Define Square class as a special case of Rectangle:
var Square = Class(Rectangle, function(length) {
	console.log('Square::initialize()');

	this._height = length;
});


// Create a rectangle with width 2 and height 4
var someRect = new Rectangle(2, 4);
// the following lines will be logged in console:
//	Figure::initialize()
//	Rectangle::initialize()

console.log(someRect.calcSquare());		// the square is: 8


// Create a square with an edge length 5
var someSqrt = new Square(5);
// the following lines will be logged in console:
//	Figure::initialize()
//	Rectangle::initialize()
//	Square::initialize()

console.log(someSqrt.calcSquare());		// the square is: 25
```


## Links
* [API](http://valerii-zinchenko.github.io/class-wrapper/doc/index.html)
* [Code coverage](http://valerii-zinchenko.github.io/class-wrapper/coverage/index.html)
* [Run unit tests](http://valerii-zinchenko.github.io/class-wrapper/test/index.html)

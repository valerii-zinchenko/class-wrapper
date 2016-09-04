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

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


suite('utils', function() {
    suite('Object manipulations.', function() {
        var v1 = 11,
            v2 = 4,
            v3 = 19,
            v4 = 90;
        var obj1, obj2;

        setup(function() {
            obj1 = {
                value: v1,
                innObj: {
                    innValue: v2
                },
                innObj2: {
                    innInnObj: {
                        innInnVal: v4
                    }
                },
                empty: null,
                array: [v3]
            };
            obj2 = {
                value: v3,
                innObj2: {
                    innInnObj: {},
					innInnV: v1
                }
            };
        });
        teardown(function() {
            obj1 = null;
            obj2 = null;
        });

        test('deepExtend()', function() {
            utils.deepExtend(obj2, obj1);

            assert.equal(obj2.value, v3);
            assert.equal(obj2.innObj.innValue, v2);
            assert.notEqual(obj2.innObj, obj1.innObj);
            assert.isObject(obj2.innObj2.innInnObj);
			assert.equal(obj2.innObj2.innInnV, v1);
            assert.equal(obj2.innObj2.innInnObj.innInnVal, v4);
            assert.property(obj2, 'empty', 'Extended object was not extended with property "empty"');
            assert.property(obj2, 'array', 'Extended object was not extended with property "array"');
			assert.equal(obj2.array[0], v3);
            assert.notEqual(obj2.array, obj1.array, 'Array should be copied into the extended object');
        });
        test('deepCopy()', function() {
            utils.deepCopy(obj2, obj1);

            assert.equal(obj2.value, v1);
            assert.equal(obj2.innObj.innValue, v2);
            assert.notEqual(obj2.innObj, obj1.innObj);
            assert.isObject(obj2.innObj2.innInnObj);
            assert.equal(obj2.innObj2.innInnObj.innInnVal, v4);
        });
    });

    suite('date()', function() {
        test('no arguments', function() {
            assert.doesNotThrow(function() {
                utils.date();
            });

            assert.doesNotThrow(function() {
                utils.date(new Date());
            });
        });

        test('incorrect input argument type', function() {
            assert.throw(function() {
                utils.date('str');
            }, Error, 'Incorrect input argument type');
        });

        test('correct argument', function() {
            var date = new Date();
			date.setTime(date.getTime() - date.getTimezoneOffset()*60000);
			var dateStr = date.toISOString().slice(0,10);

            assert.equal(utils.date(), dateStr, 'Incorrect date was returned from the method without input argument');
            assert.equal(utils.date(new Date()), dateStr, 'Incorrect date was returned from the method with input argument');
        });

        test('timezone invariant', function(){
            var date = new Date('Mon Nov 29 2014 00:00:00 GMT+0200 (EET)');

            assert.equal(utils.date(date), '2014-11-29', 'Timezone should not have an influence');
        });
    });

	test('whatIs', function(){
		[
			['', 'String'],
			[1, 'Number'],
			[true, 'Boolean'],
			[[], 'Array'],
			[{}, 'Object'],
			[function(){}, 'Function']
		].forEach(function(testCase){
			var result;
			assert.doesNotThrow(function(){
				result = utils.whatIs(testCase[0]);
			});
			assert.equal(result, '[object ' + testCase[1] + ']', 'Input was incorrectly converted into the string');
		});
	});

	suite('is', function(){
		setup(function(){
			sinon.stub(utils, 'whatIs');
		});
		teardown(function(){
			utils.whatIs.restore();
		});

		test('different types', function(){
			var data = [];
			utils.whatIs.returns('[object String]');

			var result;
			assert.doesNotThrow(function(){
				result = utils.is(data, 'Object');
			});

			assert.isTrue(utils.whatIs.withArgs(data).calledOnce, 'whatIs should be called in order to determine the type');
			assert.isFalse(result, 'Different types are not equal');
		});

		test('same types', function(){
			var data = [];
			utils.whatIs.returns('[object Array]');

			var result;
			assert.doesNotThrow(function(){
				result = utils.is(data, 'Array');
			});

			assert.isTrue(utils.whatIs.withArgs(data).calledOnce, 'whatIs should be called in order to determine the type');
			assert.isTrue(result, 'Same types are equal');
		});
	});

	test('isObject()', function(){
		assert.isTrue(utils.isObject({}), 'Object was incorrectly detected');
		[
			[null, 'Null'],
			[undefined, 'Undefined'],
			[function(){}, 'Function'],
			[[], 'Array'],
			[false, 'Boolean'],
			[1, 'Number'],
			['str', 'String']
		].forEach(function(testCase){
			assert.isFalse(utils.isObject(testCase[0]), testCase[1] + ' is not a object');
		});
	});

	test('isArray()', function(){
		assert.isTrue(utils.isArray([]), 'Array was incorrectly detected');
		[
			[null, 'Null'],
			[undefined, 'Undefined'],
			[function(){}, 'Function'],
			[{}, 'Object'],
			[false, 'Boolean'],
			[1, 'Number'],
			['str', 'String']
		].forEach(function(testCase){
			assert.isFalse(utils.isArray(testCase[0]), testCase[1] + ' is not an array');
		});
	});

	test('isString()', function(){
		assert.isTrue(utils.isString(''), 'String was incorrectly detected');
		[
			[null, 'Null'],
			[undefined, 'Undefined'],
			[function(){}, 'Function'],
			[{}, 'Object'],
			[false, 'Boolean'],
			[1, 'Number'],
			[[], 'Array']
		].forEach(function(testCase){
			assert.isFalse(utils.isString(testCase[0]), testCase[1] + ' is not a string');
		});
	});

	test('isObjectEmpty()', function(){
		assert.isTrue(utils.isObjectEmpty({}));
		assert.isFalse(utils.isObjectEmpty({a:1}));
	});

	suite('compareVersions()', function(){
		[
			['0.0.0', '1.0.0', -1],
			['1.0.0', '1.0.0', 0],
			['2.0.0', '1.0.0', 1],
			['2.0.0', '1.10.0', 1],
			['0.10.0', '0.2.0', 1],
			['0.10.0', '0.0.2', 1]
		].forEach(function(testCase){
			var msg = testCase[0] + ' is ';
			switch(testCase[2]) {
				case -1:
					msg += 'lower';
					break;
				case 0:
					msg += 'equal';
					break;
				case 1:
					msg += 'greater';
					break;
			}
			msg += ' than ' + testCase[1];

			var result;
			assert.doesNotThrow(function(){
				result = utils.compareVersions(testCase[0], testCase[1]);
			});
			assert.equal(result, testCase[2], msg);
		});
	});
});

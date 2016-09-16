module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var banner = '// <%= pkg.description %>\n'+
				 '// v<%= pkg.version %>\n' +
				 '// Copyright (c) 2016  Valerii Zinchenko\n' +
				 '// License: http://valerii-zinchenko.github.io/<%= pkg.name %>/LICENSE.txt\n' +
				 '// All source files are available at: http://github.com/<%= pkg.repository %>\n';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: '\n',
				banner: banner
			},
			dest: {
				src: ['lib/utils.js', 'lib/FClass.js', 'lib/Class.js', 'lib/SingletonClass.js'],
				dest: 'dest/<%= pkg.name %>.js'
			}
		},

		wrap: {
			amd: {
				src: ['dest/<%= pkg.name %>.js'],
				dest: 'dest/<%= pkg.name %>_amd.js',
				options: {
					wrapper: [
						'(function (root, factory) {\n' +
						'	if(typeof define === "function" && define.amd) {\n' +
						'		define([], factory);\n' +
						'	} else if(typeof module === "object" && module.exports) {\n' +
						'		module.exports = factory();\n' +
						'	} else {\n' +
						'		root.classWrappers = factory();\n' +
						'	}\n' +
						'})(this, function() {',
						// code will be placed right here
						'	return {\n' +
						'		utils: utils,\n' +
						'		FClass: FClass,\n' +
						'		Class: Class,\n' +
						'		SingletonClass: SingletonClass\n' +
						'	};\n' +
						'});'
					]
				}
			}
		},

		uglify: {
			options: {
				banner: banner
			},
			dist: {
				files: {
					'dest/<%= pkg.name %>.min.js': 'dest/<%= pkg.name %>.js',
					'dest/<%= pkg.name %>_amd.min.js': 'dest/<%= pkg.name %>_amd.js',
				}
			}
		},

		template: {
			test: {
				options: {
					data: {
						jsFolder: '../lib'
					}
				},
				files: {
					'test/index.html': ['test/index.tpl.html']
				}
			},
			coverage: {
				options: {
					data: {
						jsFolder: '../js-cov'
					}
				},
				files: {
					'test/index.html': ['test/index.tpl.html']
				}
			}
		},

		prepareForCoverage: {
			instrument: {
				files: [{
					expand: true,
					cwd: './lib',
					src: '*.js',
					dest: 'js-cov'
				}]
			}
		},
		mocha: {
			test: {
				options: {
					run: false,
					reporter: 'Spec',
					log: true,
					logErrors: true
				},
				src: ['test/index.html']
			},
			coverage: {
				options: {
					run: false,
					reporter: 'Spec',
					log: true,
					logErrors: true,
					coverage: {
						htmlReport: 'coverage'
					}
				},
				src: ['test/index.html']
			}
		},

		jsdoc: {
			doc: {
				src: ['./lib/*.js'],
				options: {
					destination: 'doc',
					readme: 'README.md'
				}
			}
		},

		clean: {
			coverage: ['js-cov'],
			build: ['dest']
		}
	});


	grunt.registerMultiTask('prepareForCoverage', 'Generates coverage reports for JS using Istanbul', function() {
		var istanbul = require('istanbul');
		var ignore = this.data.ignore || [];
		var instrumenter = new istanbul.Instrumenter();

		this.files.forEach(function(file) {
			var filename = file.src[0];
			var instrumented = grunt.file.read(filename);

			if (!grunt.file.isMatch(ignore, filename)) {
				instrumented = instrumenter.instrumentSync(instrumented, filename);
			}

			grunt.file.write(file.dest, instrumented);
		});
	});


	[
		['build', ['clean', 'concat', 'wrap', 'uglify']],
		['test', ['template:test', 'mocha:test']],
		['coverage', ['prepareForCoverage', 'template:coverage', 'mocha:coverage', 'clean:coverage']],
		['doc', ['jsdoc']]
	].forEach(function(registry){
		grunt.registerTask(registry[0], registry[1]);
	});
};

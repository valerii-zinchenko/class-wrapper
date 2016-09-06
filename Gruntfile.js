module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var banner = '// CPP class v<%= pkg.version %>\n' +
				 '// Copyright (c) 2016  Valerii Zinchenko\n' +
				 '// License: http://valerii-zinchenko.github.io/cpp-class/LICENSE.txt\n' +
				 '// All source files are available at: http://github.com/<%= pkg.repository %>\n';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: ';\n',
				banner: banner
			},
			dest: {
				src: ['lib/utils.js', 'lib/FClass.js', 'lib/Class.js', 'lib/SingletonClass.js', 'lib/cpp-class.js'],
				dest: 'dest/cpp-class.js'
			}
		},

		wrap: {
			amd: {
				src: ['dest/cpp-class.js'],
				dest: 'dest/cpp-class_amd.js',
				options: {
					wrapper: [
						'define("cppClass", [], function() {',
						'return cppClass;});'
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
					'dest/cpp-class.min.js': 'dest/cpp-class.js',
					'dest/cpp-class_amd.min.js': 'dest/cpp-class_amd.js',
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
			coverage: ['js-cov']
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


	grunt.registerTask('build', ['concat', 'wrap', 'uglify']);
	grunt.registerTask('test', ['template:test', 'mocha:test']);
	grunt.registerTask('coverage', ['prepareForCoverage', 'template:coverage', 'mocha:coverage', 'clean']);
	grunt.registerTask('doc', ['jsdoc']);
};

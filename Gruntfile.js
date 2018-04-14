module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var banner = '// <%= pkg.description %>\n'+
				 '// v<%= pkg.version %>\n' +
				 '// Copyright (c) 2016-2017 <%= pkg.author %>\n' +
				 '// Licensed under MIT (https://github.com/valerii-zinchenko/<%= pkg.name %>/blob/master/LICENSE.txt)\n' +
				 '// All source files are available at: http://github.com/<%= pkg.repository %>\n';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: '\n',
				banner: banner
			},
			dest: {
				src: ['lib/utils.js', 'lib/ClassBuilder.js', 'lib/Class.js', 'lib/SingletonClass.js', 'lib/index.js'],
				dest: 'dest/<%= pkg.name %>.js'
			}
		},

		umd: {
			pkg: {
				options: {
					src: ['dest/<%= pkg.name %>.js'],
					dest: 'dest/<%= pkg.name %>.js',
					template: 'umd.hbs',
					objectToExport: 'ClassWrapper',
					globalAlias: 'class-wrapper'
				}
			}
		},

		uglify: {
			options: {
				banner: banner
			},
			dist: {
				files: {
					'dest/<%= pkg.name %>.min.js': 'dest/<%= pkg.name %>.js'
				}
			}
		},

		template: {
			test: {
				options: {
					data: {
						isPROD: false,
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
						isPROD: false,
						jsFolder: '../js-cov'
					}
				},
				files: {
					'test/index.html': ['test/index.tpl.html']
				}
			},
			'prod-test': {
				options: {
					data: {
						isPROD: true
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
			options: {
				configure: 'jsdoc.conf.json',
			},

			doc: {
				src: ['./lib/*.js'],
				options: {
					package: "package.json",
				}
			},

			nightly: {
				src: ['./lib/*.js'],
				options: {
					destination: 'doc/nightly'
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
		['build', ['clean:build', 'concat', 'umd', 'uglify', 'template:test']],
		['test', ['template:test', 'mocha:test']],
		['coverage', ['prepareForCoverage', 'template:coverage', 'mocha:coverage', 'clean:coverage', 'template:test']],
		['doc', ['jsdoc']]
	].forEach(function(registry){
		grunt.registerTask(registry[0], registry[1]);
	});
};

var lrSnippet = require( 'connect-livereload' )({
	port: 8080
});

var mountFolder = function ( connect, dir ) {
	return connect.static( require( 'path' ).resolve( dir ) );
};

module.exports = function ( grunt ) {

	pkg: grunt.file.readJSON('package.json'),
	require( 'matchdep' ).filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	grunt.initConfig({
		connect: {
			options: {
				port: 9000,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					middleware: function ( connect ) {
						return [
							lrSnippet,
							mountFolder(connect, 'dist')
						];
					}
				}
			}
		},
		tag: {
			banner: "/*!\n" +
					" * Penguins Rising\n" +
					" * @author Anthony Fassett\n" +
					" * @version 2.0.0\n" +
					" * Copyright 2015.\n" +
					" */\n"
		},
		uglify: {
			dist: {
				files: {
					'js/game.min.js': [ 'src/js/*.js' ]
				}
			},
			options: {
				banner: "<%= tag.banner %>"
			}
		},
		cssmin: {
		  target: {			
			files: [{
			  'content/index.css': ['src/content/*.css']
			 }]
		  }
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'index.html': 'src/index.html'
				}
			}
		},
		imagemin: {
			static: {
				options: {
					optimizationLevel: 3				
				}
			},
			dynamic: {
				files: [{
					expand: true,
					cwd: 'src/content/img/',
					src: ['*.{png,jpg,gif}'],
					dest: 'content/img/'
				}]
			}
		},
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: 'src/content/audio/',
					src: ['**/*'],
					dest: 'content/audio/',
					filter: 'isFile'
				},
			]}
		}, 
		jshint: {
			files: {
				src: ['src/js/*.js']
			},
			options: {
				 jshintrc: 'src/js/.jshintrc'
			}
		},
		'gh-pages': {
		    options: {
		        base: './'
		    },
		    src: ['**']
		},
		"jsbeautifier" : {
			files : ['src/js/*.js'],
			options : {
				js: {
				  braceStyle: "collapse",
				  breakChainedMethods: false,
				  e4x: false,
				  evalCode: false,
				  indentChar: " ",
				  indentLevel: 0,
				  indentSize: 4,
				  indentWithTabs: false,
				  jslintHappy: false,
				  keepArrayIndentation: false,
				  keepFunctionIndentation: false,
				  maxPreserveNewlines: 10,
				  preserveNewlines: true,
				  spaceBeforeConditional: true,
				  spaceInParen: false,
				  unescapeStrings: false,
				  wrapLineLength: 0
			  }
			}
		}
	});

	grunt.registerTask( 'default' , [
		'cssmin',
		'uglify',
		'htmlmin',
		'imagemin',
		'jshint',
		'copy',
		'jsbeautifier'
	]);

};
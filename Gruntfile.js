'use strict';

module.exports = function ( grunt ) {

	pkg: grunt.file.readJSON('package.json'),
	require( 'matchdep' ).filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	grunt.initConfig({		
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
		}
	});

	grunt.registerTask( 'default' , [
		'cssmin',
		'uglify',
		'htmlmin',
		'imagemin',
		'jshint',
		'copy'
	]);

};
'use strict';

var gulp = require('gulp');
var files = require('./files');

// load dependencies
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minify = require('gulp-minify-css'); //css
var uglify = require('gulp-uglify'); //js
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var del = require('del');

// release
gulp.task('default', ['release']);
gulp.task('release', ['release:css', 'release:js']); // add jslint and uTest later maybe

gulp.task('clean', function(cb) {

	del([files.release], cb);
});

gulp.task('release:css', ['clean'], function() {

	//css
	return gulp.src(files.css)
			.pipe(concat(files.destCss))
            .pipe(gulp.dest(files.destLib))
			.pipe(autoprefixer({
				browsers: ['> 5%', 'last 5 version', 'ie 8']	
			})) // auto-prefix
			.pipe(rename({suffix:'.min'}))
			.pipe(minify())
			.pipe(gulp.dest(files.release));
});

gulp.task('release:js', ['clean'], function() {

	//js
    return gulp.src(files.js)
            .pipe(concat(files.destJs))
            .pipe(gulp.dest(files.destLib)) 
			//js hint before uglify
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'))
			//uglify
			.pipe(rename({suffix:'.min'}))
			.pipe(uglify())
			.pipe(gulp.dest(files.release));
});

//-----------------------------------------------> for dev

gulp.task('dev', ['concat', 'watch', 'server']);
gulp.task('concat', ['concat:css', 'concat:js']);

gulp.task('server', function() {

	return nodemon({
			ignore: files.monignore,
			ext: "js"
		});
});

// concat css
gulp.task('concat:css', function() {

	return gulp.src(files.css)
			.pipe(concat(files.destCss))
			.pipe(gulp.dest(files.destLib))
			.pipe(livereload());
});

// concat js
gulp.task('concat:js', function() {

	return gulp.src(files.js)
			.pipe(concat(files.destJs))
			.pipe(gulp.dest(files.destLib))
			.pipe(livereload());
});

gulp.task('reloadView', function() {

	//views
	return gulp.src(files.views)
			.pipe(livereload());
});

gulp.task('watch', function() {

	livereload.listen();

	gulp.watch(files.js, ['concat:js']);
	gulp.watch(files.css, ['concat:css']);
	gulp.watch(files.views, ['reloadView']);
});
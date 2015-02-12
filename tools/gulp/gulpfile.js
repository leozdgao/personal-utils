'use strict';

var gulp = require('gulp');
var path = require('path');
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

// release
gulp.task('default', ['release']);
gulp.task('release', ['lint']); // add jslint and uTest later maybe
gulp.task('lint', ['assets'], function() {

	return gulp.src(path.resolve(files.destLib, files.destJs))
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish')); // { verbose: true }
});
gulp.task('assets', ['assets:css', 'assets:js']);

gulp.task('dev', ['concat', 'watch', 'server']);
gulp.task('concat', ['concat:css', 'concat:js']);

//
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

gulp.task('assets:css', ['concat:css'], function() {

	//css
	return gulp.src(path.resolve(files.destLib, files.destCss))
			.pipe(autoprefixer({
				browsers: ['> 5%', 'last 5 version', 'ie 8']	
			})) // auto-prefix
			.pipe(rename({suffix:'.min'}))
			.pipe(minify())
			.pipe(gulp.dest(files.release));
});

gulp.task('assets:js', ['concat:js'], function() {

	//js
	return gulp.src(path.resolve(files.destLib, files.destJs))
			.pipe(rename({suffix:'.min'}))
			.pipe(uglify())
			.pipe(gulp.dest(files.release));
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
var gulp = require('gulp');

var gutil = require('gulp-util');

var jshint = require('gulp-jshint');

var usemin = require('gulp-usemin');

var uglify = require('gulp-uglify');

var minifyCss = require('gulp-minify-css');

var express = require('express');

var browserSync = require('browser-sync');

gulp.task('jshint', function () {
    gulp.src('public/js/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('default',['jshint','templates'], function () { /*'startExpress' was here removed to not throw error as of running express*/
    gulp.src('public/templates/index.html')
         .pipe(usemin({
             assetsDir: 'public/',
             css: [minifyCss(), 'concat'],
             js: [uglify(), 'concat']
         }))
         .pipe(gulp.dest('website'));
});

gulp.task('templates', function () {
    gulp.src(['public/templates/**/*.html', '!public/templates/index.html'])
	.pipe(gulp.dest('website/templates/'));

});

gulp.task('startExpress',['serve'], function () {

    var app = express();
    app.use(express.static(__dirname + '/website'));
    app.listen(4000);
});

gulp.task('serve', function () {
    browserSync(
	{
	    proxy: "http://localhost:4000/"
	}
	);
});



gulp.task('watch', ['default','startExpress'], function () { /*Run default the first type command is sent gulp watch*/
    var watchFiles = [
        'public/templates/**/*.html',
		'public/js/**/*.js',
        'public/js/*.js',
        '!public/js/**/*.min.js',
        'public/css/*.css',
        '!public/css/*.min.css'
    ];

    gulp.watch(watchFiles, ['default']).on("change", browserSync.reload);
});

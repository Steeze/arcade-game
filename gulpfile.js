// grab our packages
var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    eslint = require('gulp-eslint'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    open = require('gulp-open');

gulp.task('default', ['watch', 'build-js']);

gulp.task('open', function(){
    gulp.src('index.html')
        .pipe(open());
});

gulp.task('jshint', function() {
    return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint', function () {
    return gulp.src(['js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('build-js', function() {
    return gulp.src(['js/resources.js', 'js/app.js', 'js/engine.js'])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('js/**/*.js', ['jshint', 'lint', 'build-js']);
});
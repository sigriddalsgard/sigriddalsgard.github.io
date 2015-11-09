'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');

gulp.task('css', ['css:clean'], function () {
  return gulp.src('css/*.css')
    .pipe($.cssnext())
    .pipe($.cssnano())
    .pipe(gulp.dest('dist'));
});

gulp.task('css:clean', function () {
  return del(['dist/*.css']);
});

gulp.task('html', ['html:clean'], function () {
  return gulp.src('html/*.html')
    .pipe($.minifyHtml())
    .pipe(gulp.dest('dist'));
});

gulp.task('html:clean', function () {
  return del(['dist/*.html']);
});

gulp.task('img', ['img:clean'], function () {
  return gulp.src('img/**/*.{jpg,png}')
    .pipe($.imagemin())
    .pipe(gulp.dest('dist'));
});

gulp.task('img:clean', function () {
  return del(['dist/**/*.{jpg,png}']);
});

gulp.task('build', [
  'css',
  'html',
  'img'
]);

gulp.task('watch', ['build'], function () {
  gulp.watch('css/**/*.css', ['css']);
  gulp.watch('html/**/*.html', ['html']);
});

gulp.task('serve', ['watch'], function () {
  return gulp.src('dist')
    .pipe($.webserver({
      open: true
    }));
});

gulp.task('default', ['build']);

gulp.task('deploy', ['deploy:clean', 'build'], function () {
  return gulp.src('dist/**')
    .pipe($.ghPages({
      branch: 'master',
      cacheDir: '.tmp',
      force: true
    }));
});

gulp.task('deploy:clean', function () {
  return del(['.tmp']);
});

var autoprefixer = require('autoprefixer');
var assets  = require('postcss-assets');
var gulp = require('gulp');
var path = require('path');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var postcss = require('gulp-postcss');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');


var handleError = function (err) {
  console.log(err.name, ' in ', err.plugin, ': ', err.message);
  console.log(err.getStack());
  process.exit(1);
};


gulp.task('less', function () {

  var processors = [
    assets({
      basePath: '/',
      loadPaths: ['assets/fonts/', 'assets/images/']
    }),
    autoprefixer
  ];

  return gulp.src('less/*.less')
    .pipe(less({
      //paths: [ path.join(__dirname, 'less', 'includes') ],
      outputStyle: 'nested' // :nested, :expanded, :compact, :compressed
    }).on('error', handleError))
    .pipe(postcss(processors).on('error', handleError))
    .pipe(minifyCSS())
    .pipe(gulp.dest('assets/css'));
});

// Watch
gulp.task('watch', ['less'], function () {

  gulp.watch('less/**/*.less', ['less']);

  gulp.src('')
    .pipe(webserver({
      host: '0.0.0.0',
      livereload: {
        enable: true
      },
      fallback: 'index.html'

    }));


  gulp.watch([
    'assets/!*.css',
    'index.html',
    'js/!**!/!*'
  ]).on('change', livereload.changed);
});

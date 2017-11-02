var gulp = require('gulp'),

  // browserSync
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,

  // CSS
  sass = require('gulp-sass'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  atImport = require('postcss-import'),

  // Utils
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  notify = require('gulp-notify');

// Constants
const src = '_src/';
const dev = '_dev/';
const dist = '_dist/';


// ------------------------------------------------------
// CSS
gulp.task('css', function() {
  return gulp.src([src + 'assets/sass/vissim.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
		autoprefixer({
			browsers: ['last 2 versions']
  		})
  	]))
    .pipe(rename('vissim.css'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dev + 'assets/css/'))
    .pipe(browserSync.stream({ match: '**/*.css' })) // 'match' is used to prevent reload with sourcemaps file
    .pipe(notify({ message: '✓ Main CSS complete' }));
});

// ------------------------------------------------------
// JS
gulp.task('js', function() {
  return gulp.src([src + 'assets/js/*.js'])
    .pipe(concat('vissim.js'))
    .pipe(gulp.dest(dev + 'assets/js/'))
    .pipe(notify({ message: '✓ JS complete' }))
});



// ------------------------------------------------------
// Copy HTML to dev
gulp.task('copyhtml', function() {
  return gulp.src(src + '*.html')
    .pipe(gulp.dest(dev))
});


// ------------------------------------------------------
// Reload
gulp.task('reload', function() {
	browserSync.reload();
});



// ------------------------------------------------------
// Serve - browserSync
gulp.task('serve', function() {

    browserSync.init({
        port: 3574,
        notify: false,
        server: {
            baseDir: dev
        }
    });

	// watch the CSS
	gulp.watch([src + 'assets/scss/**/*.scss'], ['css']);

  gulp.watch([src + '*.html'], ['copyhtml', 'reload']);

  gulp.watch([src + '**/*.js'], ['js']);
});

gulp.task('default', ['css', 'js', 'serve']);

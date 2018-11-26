var
  gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  del = require('del'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  environments = require('gulp-environments'),
  uglifycss = require('gulp-uglifycss'),

  paths = {
  src: 'src/**/*',
  srcPUG: ['src/**/*.pug', '!**/_*/**'],
  srcSASS: 'src/sass/*.scss',
  srcJS: 'src/js/*.js',
  srcIMG: 'src/img/**/*',

  tmp: 'tmp/',
  tmpCSS: 'tmp/css/',
  tmpJS: 'tmp/js/',
  tmpIMG: 'tmp/img/',

  dist: 'dist/',
  distCSS: 'dist/css/',
  distJS: 'dist/js/',
  distIMG: 'dist/img/',
};

var development = environments.development;
var production = environments.production;


// pug

gulp.task('pug', function () {
  return gulp.src(paths.srcPUG)
    .pipe(plumber())
    .pipe(development(pug({
      pretty: true
    })))
    .pipe(production(pug()))
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(development(gulp.dest(paths.tmp)))
    .pipe(production(gulp.dest(paths.dist)))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// sass

gulp.task('sass', function () {
  return gulp.src(paths.srcSASS)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(production(uglifycss({
      "maxLineLen": 80,
    })))
    //.pipe(production(rename({suffix: '.min'})))
    .pipe(sourcemaps.write('.'))
    .pipe(production(gulp.dest(paths.distCSS)))
    .pipe(development(gulp.dest(paths.tmpCSS)))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// js

gulp.task('js', function () {
  gulp.src(paths.srcJS)
    .pipe(plumber())
    .pipe(production(uglify()))
    .pipe(development(gulp.dest(paths.tmpJS)))
    .pipe(production(gulp.dest(paths.distJS)))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// img

gulp.task('img', function () {
  return gulp.src(paths.srcIMG)
    .pipe(plumber())
    .pipe(imagemin({
      optimizationLevel: 5
    }))
    .pipe(production(gulp.dest(paths.distIMG)))
    .pipe(development(gulp.dest(paths.tmpIMG)))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// build

gulp.task('build', ['clean', 'pug', 'sass', 'img', 'js'])


// clean

gulp.task('clean', function () {
  console.log("Remove all files in dist/ and tmp/");
  return del.sync(['dist/**', 'tmp/**'], {
    //force: true
  });
})


// watch

gulp.task('watch', ['sync'], function () {
  gulp.watch(paths.src, ['build']);
});

gulp.task('default', ['clean', 'build', 'watch']);


// sync

gulp.task('sync', function () {
  browserSync({
    server: {
      baseDir: paths.tmp
    },
    notify: false
  });
});
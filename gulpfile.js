var
  gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  del = require('del'),

  paths = {
  src: 'src/**/*',
  srcPUG: ['src/**/*.pug', '!**/_*/**'],
  srcSASS: 'src/sass/*.scss',
  srcJS: 'src/js/*.js',
  srcIMG: 'src/img/**/*',

  dist: 'dist/',
  distIndex: 'dist/**/*.html',
  distCSS: 'dist/css/',
  distJS: 'dist/js/',
  distIMG: 'dist/img/',
};


// pug

gulp.task('pug', function () {
  return gulp.src(paths.srcPUG)
    .pipe(pug())
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// img

gulp.task('img', function () {
  return gulp.src(paths.srcIMG)
    .pipe(imagemin({
      optimizationLevel: 5
    }))
    .pipe(gulp.dest(paths.distIMG))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// sass

gulp.task('sass', function () {
  return gulp.src(paths.srcSASS)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest(paths.distCSS))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// js

gulp.task('js', function () {
  gulp.src(paths.srcJS)
    .pipe(gulp.dest(paths.distJS))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// build

gulp.task('build', ['clean', 'pug', 'sass', 'img', 'js'])


// clean

gulp.task('clean', function () {
  console.log("Remove all files in dist");
  return del.sync(['dist/**'], {
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
      baseDir: paths.dist
    },
    notify: false
  });
});
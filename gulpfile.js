const
  gulp = require('gulp'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  browsersync = require('browser-sync'),
  del = require('del'),
  plumber = require('gulp-plumber'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  uglifycss = require('gulp-uglifycss'),

  mode = require('gulp-mode')({
    modes: ["production", "development"],
    default: "development",
    verbose: false,
  }),

  paths = {
    src: 'src/**/*',
    srcPUG: ['src/**/*.pug', '!**/_*/**'],
    srcSASS: 'src/sass/main.sass',
    srcJS: 'src/js/*.js',
    srcPHP: 'src/php/*.php',
    srcIMG: 'src/img/**/*',
    srcFONTS: 'src/fonts/**/*',
    srcFAVICON: 'src/favicons/*',

    tmp: 'tmp/',
    tmpCSS: 'tmp/css/',
    tmpJS: 'tmp/js/',
    tmpPHP: 'tmp/php/',
    tmpIMG: 'tmp/img/',
    tmpFONTS: 'tmp/fonts/',

    dist: 'dist/',
    distCSS: 'dist/css/',
    distJS: 'dist/js/',
    distPHP: 'dist/php/',
    distIMG: 'dist/img/',
    distFONTS: 'dist/fonts/',
  };

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: paths.tmp,
    },
    port: 3000,
    notify: false
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean
function clean() {
  if (mode.production()) return del(paths.dist)
  else return del(paths.tmp)
}

// pug 
function _pug() {
  return gulp.src(paths.srcPUG)
    .pipe(plumber())
    .pipe(pug())
    .on('error', function(err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(mode.production(gulp.dest(paths.dist)))
    .pipe(mode.development(gulp.dest(paths.tmp)))
    .pipe(browsersync.stream());
}

// CSS task
function css() {
  return gulp.src([paths.srcSASS])
    .pipe(plumber())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(mode.production(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    })))
    .pipe(mode.production(gulp.dest(paths.distCSS)))
    .pipe(mode.development(gulp.dest(paths.tmpCSS)))
    .pipe(browsersync.stream({
      stream: true
    }));
}

// php 
function php() {
  return gulp.src(paths.srcPHP)
  .pipe(plumber())
  .pipe(mode.production(gulp.dest(paths.distPHP)))
  .pipe(mode.development(gulp.dest(paths.tmpPHP)))
  .pipe(browsersync.stream());
}

// JS
function js() {
  return gulp.src(['node_modules/babel-polyfill/dist/polyfill.js', paths.srcJS])
    .pipe(plumber())
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(mode.production(uglify({
      compress: {
        drop_console: true
      }
    })))
    .pipe(mode.production(gulp.dest(paths.distJS)))
    .pipe(mode.development(gulp.dest(paths.tmpJS)))
    .pipe(browsersync.stream())
}

// Json
function json() {
  return gulp.src('src/*.json')
    .pipe(plumber())
    .pipe(mode.development(gulp.dest(paths.tmp)))
    .pipe(mode.production(gulp.dest(paths.dist)))
    .pipe(browsersync.stream());
}

// Images
function images() {
  return gulp.src(paths.srcIMG)
    .pipe(plumber())
    .pipe(mode.development(gulp.dest(paths.tmpIMG)))
    .pipe(mode.production(gulp.dest(paths.distIMG)))
    .pipe(browsersync.stream());
}

// favicon
function favicon() {
  return gulp
    .src(paths.srcFAVICON)
    .pipe(plumber())
    .pipe(mode.development(gulp.dest(paths.tmp)))
    .pipe(mode.production(gulp.dest(paths.dist)))
    .pipe(browsersync.stream());
}

// fonts
function fonts() {
  return gulp.src(paths.srcFONTS)
    .pipe(plumber())
    .pipe(mode.development(gulp.dest(paths.tmpFONTS)))
    .pipe(mode.production(gulp.dest(paths.distFONTS)))
    .pipe(browsersync.stream());
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(_pug, php, json, fonts, css, images, favicon, js));
const inject = gulp.parallel(css);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Watch files
function watchFiles() {
  gulp.watch(['src/fonts/**/*', 'src/img/**/*', 'src/js/*.js', 'src/**/*.pug'], build);
  gulp.watch(['src/sass/*.scss', 'src/sass/*.sass'], inject)
}

// export tasks
exports.images = images;
exports.sass = css;
exports.clean = clean;
exports.build = build;
exports.inject = inject;
exports.watch = watch;
exports.default = build;
//exports.deploy = deploy;
exports.s = watch;
exports.serve = watch;
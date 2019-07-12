const
  gulp = require('gulp'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  browsersync = require('browser-sync'),
  del = require('del'),
  plumber = require('gulp-plumber'),

  paths = {
    src: 'src/**/*',
    srcPUG: ['src/**/*.pug', '!**/_*/**'],
    srcSASS: 'src/sass/*.scss',
    srcJS: 'src/js/*.js',
    srcPHP: 'src/php/*.php',
    srcIMG: 'src/img/**/*',

    tmp: 'tmp/',
    tmpCSS: 'tmp/css/',
    tmpJS: 'tmp/js/',
    tmpPHP: 'tmp/php/',
    tmpIMG: 'tmp/img/',

    dist: 'dist/',
    distCSS: 'dist/css/',
    distJS: 'dist/js/',
    distPHP: 'dist/php/',
    distIMG: 'dist/img/',
  };

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: paths.dist,
      reloadDelay: 100,
      //directory: true
      snippetOptions: {
        whitelist: ["/**"],
      },
    },
    port: 3000
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
  return del([paths.dist]);
}

// pug 
function task_pug(){
  return gulp.src(paths.srcPUG)
    .pipe(plumber())
    .pipe(pug())
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(paths.dist))
    .pipe(browsersync.stream());
}

// php 
function task_php(){
  return gulp.src(paths.srcPHP)
    .pipe(plumber())
    .pipe(gulp.dest(paths.distPHP))
    .pipe(browsersync.stream());
}

// Images
function images() {
  return gulp.src(paths.srcIMG)
    .pipe(plumber())
    .pipe(gulp.dest(paths.distIMG))
    .pipe(browsersync.stream());
}

// favicon
function favicon(){
  return gulp.src('./src/*.ico')
    .pipe(plumber())
    .pipe(gulp.dest(paths.dist))
    .pipe(browsersync.stream());
}

// CSS task
function task_sass() {
  return gulp.src(paths.srcSASS)
    .pipe(plumber())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest(paths.distCSS))
    .pipe(browsersync.stream());
}

// JS
function task_js() {
  return gulp.src(paths.srcJS)
    .pipe(plumber())
    .pipe(gulp.dest(paths.distJS))
    .pipe(browsersync.stream())
}

// define complex tasks
const js = gulp.series(task_js);
const build = gulp.series(clean, gulp.parallel(task_pug, task_php, task_sass, images, favicon, js));
const watch = gulp.parallel(build, watchFiles, browserSync);

// Watch files
function watchFiles() {
  gulp.watch(paths.src, build);
}

// export tasks
exports.images = images;
exports.sass = task_sass;
exports.js = js;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
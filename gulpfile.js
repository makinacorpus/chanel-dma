var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var debug = require('gulp-debug');
var notify = require('gulp-notify');
var d = "./src/chanel.skin/chanel/skin/static/";
var lessfiles = [d+'css/theme.less'];
var lessfiles_watch = [d+'css/**/*.less'];

w = process.cwd();
styles = gulp.task(
    'styles',
    function() {
        return gulp.src(lessfiles)
        .pipe(less())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename("theme.css"))
        .pipe(gulp.dest(d+'css/'))
        .pipe(notify({message: 'Styles task complete'}))
        // .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(d+'css/'))
        .pipe(notify({message: 'Styles task min complete'}));
    });

gulp.task('default', ['styles']);
gulp.task('watch', function() {
  gulp.watch(lessfiles_watch, ['styles']);
});


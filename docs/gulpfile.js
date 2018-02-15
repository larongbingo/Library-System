'use strict';

/**
 * Basic concept follows https://www.justinmccandless.com/post/a-tutorial-for-getting-started-with-gulp/
 */
const gulp = require('gulp');

// Include plug-ins
const babel = require('gulp-babel');

// Base for specifying paths in gulp.src and gulp.dest
const distDir = './';

// Copy all files to the dist directory. On the master-branch, we cannot clean the dist directory
// first if it is the root directory.
gulp.task('_copy', function () {
    return gulp.src(['src/**/*']).pipe(gulp.dest(distDir));
});

// Transpile the javascript files to ES5 in the dist directory (in-place)
gulp.task('_javascripts', ['_copy'], function () {
    return gulp.src('js/**/*.js', {base: distDir, cwd: distDir})
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(distDir));
});

// Default task producing a jekyll-ready site in the dist folder
gulp.task('default', ['_javascripts']);

// Run Jekyll
gulp.task('jekyll', ['default'], function (gulpCallBack) {
    let spawn = require('child_process').spawn;
    let jekyll = spawn('jekyll', ['serve'], {stdio: 'inherit'});

    jekyll.on('exit', function (code) {
        gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
    });
});

const gulp = require('gulp');
const minimist = require('minimist');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const pug = require('gulp-pug');
const del = require('del');

const options = minimist(process.argv.slice(2), {
    default: {
        gl: '25',
        P: false,
    }
});

const srcBase = './src/gl/' + options.gl + "/";

gulp.task("webpack", function(){
    let conf = webpackConfig;
    conf.entry.main = srcBase + '/ts/main.ts';
    conf.output.filename = 'main.js';

    if (options.P) {
        conf.mode = 'production';
    } else {
        conf.mode = 'development'
    }

    return webpackStream(conf, webpack).on('error', function (e) {
            this.emit('end');
        })
        .pipe(gulp.dest("./public/gl/js/"))
        .unpipe(browserSync.reload());
});

gulp.task('pug', function(){
    return gulp.src([srcBase + 'pug/**/*.pug', srcBase + 'pug/**/_*.pug'])
        .pipe(plumber())
        .pipe(pug({
            pretty: true,
            locals: {
                title: options.gl,
            }
        }))
        .pipe(gulp.dest('./public/gl/'));
});

gulp.task("sass", function(){
    return gulp.src(srcBase + "scss/style.scss")
        .pipe(plumber())
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest("./public/gl/css/"))
        .pipe(browserSync.stream());
});

gulp.task("sass-global", function(){
    return gulp.src("./src/scss/style.scss")
        .pipe(plumber())
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest("./public/css/"))
        .pipe(browserSync.stream());
});

gulp.task('copy', function(c){
    gulp.src([srcBase + 'assets/**/*']).pipe(gulp.dest('./public/gl/assets/'));
    c();
});

gulp.task('browser-sync', function(){

    browserSync.init({
        server: {
            baseDir: "public/",
            index: "index.html"
        },
        startPath: './gl/',
    });
});

gulp.task('reload', function(){
    browserSync.reload();
})

gulp.task('clean', function(c){
    del([
        './public/',
    ], {
        force: true,
    }).then(paths => {
        c();
    });
});

gulp.task('watch', function(){
    gulp.watch(srcBase + 'ts/**/*', gulp.series('webpack'));
    gulp.watch(srcBase + 'scss/*.scss', gulp.task('sass'));
    gulp.watch(srcBase + 'pug/**/*.pug', gulp.task('pug'));
    gulp.watch(srcBase + '**/*', gulp.task('copy'));

    gulp.watch('./src/scss/*.scss', gulp.task('sass-global'));
});

gulp.task('default', gulp.series(
    'clean',
    'copy',
    gulp.parallel(
        'webpack', 'sass','sass-global', 'pug'
    ),
    gulp.parallel('browser-sync', 'watch'),
))
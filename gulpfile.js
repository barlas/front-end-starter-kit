var gulp        = require('gulp'),
    uglify      = require('gulp-uglifyjs'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    watch       = require('gulp-watch'),
    browserSync = require('browser-sync');

var paths = {
    ext: [
        'src/assets/scripts/externals/jquery-2.2.0.min.js'
    ],
    app: [
        'src/assets/scripts/app/app.js'
    ],
    styles: [
        'src/assets/styles/styles.scss'
    ]
};

// Start Server
gulp.task('browser-sync', function() {
    browserSync({
        proxy   : 'http://localhost',
        port    : 3001
    });
});

// Scripts Task
gulp.task('externals', function() {
    return gulp.src(paths.ext)
        .pipe(uglify('ext.min.js'))
        .pipe(gulp.dest('./src/assets/scripts/'));
});
gulp.task('scripts', function(){
    gulp.src(paths.app)
        .pipe(uglify('app.min.js', {
            outSourceMap    : true,
            sourceRoot      : '../../',
            mangle          : false,
            output          : {
                comments: function (node, comment) {
                    if (/^\*\*/.test(comment.value) && /\*\*$/.test(comment.value)) {
                        return true;
                    }
                }
            }
        }))
        .pipe(gulp.dest('./src/assets/scripts/'))
        .pipe(browserSync.stream());
});

// Styles Task
gulp.task('styles', function() {
    gulp.src(paths.styles)
        //.pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole : true,
            outputStyle     : 'compressed'
        }))
        //.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/assets/styles/'))
        .pipe(browserSync.stream());
});

// Run All Tasks
gulp.task('default', ['browser-sync','externals','scripts','styles'], function () {

    gulp.watch(paths.app, ['scripts']);
    gulp.watch('src/assets/styles/**/*.scss', ['styles']);

    gulp.watch('src/*.html', browserSync.reload);
});
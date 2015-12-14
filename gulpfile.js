var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('server', function() {
    nodemon({
        script: 'index.js'
    });
});

gulp.task('default', ['server']);


(function main() {

    "use strict";

    /**
     * @constant OPTIONS_PATH
     * @type {String}
     */
    var OPTIONS_PATH = 'options.yml';

    var yaml         = require('js-yaml'),
        argv         = require('yargs').argv,
        fs           = require('fs'),
        gulp         = require('gulp'),
        jshint       = require('gulp-jshint');

    /**
     * @property {Object} config
     * @property {String} config.components
     */
    var config = yaml.safeLoad(fs.readFileSync(OPTIONS_PATH, 'utf8'));

    gulp.task('lint', function() {

        return gulp.src(config.documents.scripts)
                   .pipe(jshint())
                   .pipe(jshint.reporter(require('jshint-stylish')));

    });

    gulp.task('test', ['lint']);
    gulp.task('default', ['test', 'build']);

})();
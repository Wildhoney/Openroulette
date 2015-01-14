(function main() {

    /**
     * @constant COMPONENT_FILES
     * @type {String[]}
     */
    const COMPONENT_FILES = ['components/Patchwork.scss'];

    /**
     * @constant DESTINATION_RELEASE
     * @type {String}
     */
    const DESTINATION_RELEASE = 'dist';

    /**
     * @constant DESTINATION_FILENAME
     * @type {String}
     */
    const DESTINATION_FILENAME = 'patchwork.css';

    /**
     * @constant DESTINATION_FILENAME_CUSTOM
     * @type {String}
     */
    const DESTINATION_FILENAME_CUSTOM = 'patchwork.custom.css';

    /**
     * @constant DESTINATION_DEVELOPMENT
     * @type {String}
     */
    const DESTINATION_DEVELOPMENT = 'example/vendor/patchwork';

    // Gulp Dependencies...
    var gulp         = require('gulp'),
        sass         = require('gulp-sass'),
        rename       = require('gulp-rename'),
        sourcemaps   = require('gulp-sourcemaps'),
        autoprefixer = require('gulp-autoprefixer'),
        cssmin       = require('gulp-cssmin'),
        size         = require('gulp-filesize'),
        argv         = require('yargs').argv;

    gulp.task('build-sass', function buildSass() {

        var filename             = !argv.custom ? DESTINATION_FILENAME    : DESTINATION_FILENAME_CUSTOM,
            directoryRelease     = !argv.custom ? DESTINATION_RELEASE     : DESTINATION_RELEASE + '/custom',
            directoryDevelopment = !argv.custom ? DESTINATION_DEVELOPMENT : DESTINATION_DEVELOPMENT + '/custom';

        var minify = gulp.src(COMPONENT_FILES)
            .pipe(sourcemaps.init())
            .pipe(sass({ outputStyle: 'expanded' }))
            .pipe(autoprefixer({
                browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
            }))
            .pipe(rename(filename))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(directoryRelease));

        if (!argv.custom) {

            // Only non-custom builds must reside in the vendor directory for the example.
            minify.pipe(gulp.dest(directoryDevelopment));

        }

        return minify;

    });

    /**
     * @method getDirectory
     * @return {String}
     */
    var getDirectory = function getDirectory() {
        return !argv.custom ? DESTINATION_RELEASE  : DESTINATION_RELEASE + '/custom';
    };

    /**
     * @method getFilename
     * @return {String}
     */
    var getFilename = function getFilename() {
        return !argv.custom ? DESTINATION_FILENAME : DESTINATION_FILENAME_CUSTOM;
    };

    gulp.task('minify-css', ['build-sass'], function minifyCss() {

        return gulp.src(getDirectory() + '/' + getFilename())
                    .pipe(cssmin())
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(gulp.dest(getDirectory()));

    });

    gulp.task('css-filesize', ['minify-css'], function cssFilesize() {
        var filename = !argv.custom ? 'patchwork.min.css' : 'patchwork.custom.min.css';
        return gulp.src(getDirectory() + '/' + filename).pipe(size());
    });

    gulp.task('test', []);
    gulp.task('build', ['build-sass', 'minify-css', 'css-filesize']);
    gulp.task('default', ['build']);
    gulp.task('watch', function watch() {
        gulp.watch(COMPONENT_FILES, ['build']);
    });

})();
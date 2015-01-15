(function main() {

    /**
     * @constant OPTIONS_PATH
     * @type {String}
     */
    const OPTIONS_PATH = 'options.yml';

    var yaml         = require('js-yaml'),
        glob         = require('glob'),
        fs           = require('fs'),
        gulp         = require('gulp'),
        concat       = require('gulp-concat'),
        karma        = require('gulp-karma'),
        sass         = require('gulp-sass'),
        cssmin       = require('gulp-cssmin'),
        jshint       = require('gulp-jshint'),
        uglify       = require('gulp-uglify'),
        processhtml  = require('gulp-processhtml'),
        autoprefixer = require('gulp-autoprefixer');

    /**
     * @method eachVendorFile
     * @param type {String}
     * @return {Array}
     */
    var eachVendorFile = function eachVendorFile(type) {

        var modulePaths = [],
            modules     = config.dependencies[type];

        modules.forEach(function forEach(moduleName) {

            if (moduleName.match(/\//i)) {

                // Configuration actually provides relative path to the JavaScript file.
                modulePaths.push(config.directories.vendor + '/' + moduleName);
                return;

            }

            var directory = config.directories.vendor + '/' + moduleName,
                bowerPath = directory + '/bower.json',
                content   = fs.readFileSync(bowerPath, 'utf8'),
                jsonDoc   = JSON.parse(content),
                path      = directory + '/' + jsonDoc.main.replace(/^\.\//i, '');

            // Voila!
            modulePaths.push(path);

        });

        return modulePaths;

    };

    /**
     * @property {Object} config
     * @property {String} config.components
     */
    var config = yaml.safeLoad(fs.readFileSync(OPTIONS_PATH, 'utf8'));

    /** Tasks... */

    gulp.task('process-html', function processHtml() {

        gulp.src(config.directories.public + '/' + config.documents.index)
            .pipe(processhtml())
            .pipe(gulp.dest(config.directories.public));

    });

    gulp.task('concat-all', function minifyScripts() {

        var scriptName = config.directories.vendor + '/' + config.name + '.min.js',
            styleName  = config.directories.vendor + '/' + config.name + '.min.css';

        gulp.src(eachVendorFile('scripts').concat(config.documents.scripts))
            .pipe(concat({ path: scriptName, base: config.directories.vendor }))
            .pipe(uglify())
            .pipe(gulp.dest(config.directories.vendor + '/' + config.name));

        gulp.src(eachVendorFile('styles').concat(config.documents.styles))
            .pipe(concat({ path: styleName, base: config.directories.vendor }))
            .pipe(cssmin())
            .pipe(gulp.dest(config.directories.vendor + '/' + config.name));

    });

    gulp.task('js-hint', function jsHint() {

        return gulp.src(config.documents.scripts)
            .pipe(jshint())
            .pipe(jshint.reporter(require('jshint-stylish')));

    });

    gulp.task('compile-sass', function compileSass() {

        return gulp.src(config.directories.public + '/sass/*.scss')
                   .pipe(sass())
                   .pipe(autoprefixer({
                       browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
                   }))
                   .pipe(gulp.dest(config.directories.public + '/css'));

    });

    gulp.task('karma-tests', function karmaTests() {

        return gulp.src([])
            .pipe(karma({
                configFile: 'karma.conf.js',
                action: 'run'
            }))
            .on('error', function onError(error) {
                throw error;
            });

    });

    gulp.task('test', ['js-hint', 'karma-tests']);
    gulp.task('build', ['compile-sass', 'concat-all', 'process-html']);
    gulp.task('default', ['test', 'build']);
    gulp.task('watch', function watch() {
        gulp.watch(['public/sass/*', 'public/sass/**/*'], ['compile-sass']);
    });

})();
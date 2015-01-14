(function main() {

    /**
     * @constant OPTIONS_PATH
     * @type {String}
     */
    const OPTIONS_PATH = 'options.yml';

    var yaml        = require('js-yaml'),
        glob        = require('glob'),
        fs          = require('fs'),
        gulp        = require('gulp'),
        concat      = require('gulp-concat'),
        cssmin      = require('gulp-cssmin'),
        uglify      = require('gulp-uglify'),
        processhtml = require('gulp-processhtml');

    /**
     * @method eachVendorFile
     * @param type {String}
     * @return {Array}
     */
    var eachVendorFile = function eachVendorFile(type) {

        var modulePaths = [],
            modules     = config.dependencies[type];

        modules.forEach(function forEach(moduleName) {

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

    gulp.task('test', []);
    gulp.task('build', ['process-html', 'concat-all']);
    gulp.task('default', ['build']);

})();
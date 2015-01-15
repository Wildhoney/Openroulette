module.exports = function(config) {

  config.set({

    frameworks: ['jasmine'],
    files: [
      'public/vendor/angular/angular.js',
      'public/vendor/angular-mocks/angular-mocks.js',
      'public/js/*.js',
      'public/js/**/*.js',
      'tests/spec.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Firefox', 'PhantomJS'],
    singleRun: true

  });
};

/**
 * @module Openroulette
 * @submodule LocalStream
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module) {

    "use strict";

    /**
     * @directive localStream
     */
    $module.directive('localStream', ['$rootScope', '$window', '$navigator', function localStreamDirective($rootScope, $window, $navigator) {

        // Ensure we're providing cross-browser support.
        $navigator.getUserMedia = $navigator.getUserMedia || $navigator.webkitGetUserMedia || $navigator.mozGetUserMedia;
        var url                 = $window.URL || $window.webkitURL;

        return {

            /**
             * @property scope
             * @type {Object}
             */
            scope: {
                localStream: '=ngModel',
                error: '='
            },

            /**
             * @property templateUrl
             * @type {String}
             */
            templateUrl: 'partials/directive/local-stream.html',

            /**
             * @method link
             * @param scope {Object}
             * @param element {angular.element}
             * @return {void}
             */
            link: function link(scope, element) {

                scope.error = 'PermissionDeniedError';

                /**
                 * @property videoElement
                 * @type {angular.element}
                 */
                var videoElement = element.find('video');

                /**
                 * @property mediaOptions
                 * @type {Object}
                 */
                var mediaOptions = { video: true, audio: true };

                // Attempt to fetch the user's media stream for their webcam.
                $navigator.getUserMedia(mediaOptions, function onStream(stream) {

                    // Connect the stream with the local video player, and export the stream data for
                    // use by Peer.
                    scope.localStream = stream;
                    scope.$apply();

                    var streamSource = url ? url.createObjectURL(stream) : stream;
                    videoElement.attr('src', streamSource);
                    $rootScope.$broadcast('web-rtc/allowed-camera', streamSource);
                    $rootScope.$apply();

                }, function onError(error) {

                    // An error was thrown when attempting to retrieve the local stream.
                    scope.error = error.message || error.name;

                });

            }

        };

    }]);

})(window.angular.module(APP_NAME), window.navigator);
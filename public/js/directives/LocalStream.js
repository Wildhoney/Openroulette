/**
 * @module Openroulette
 * @submodule LocalStream
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module, $navigator) {

    "use strict";

    /**
     * @directive localStream
     */
    $module.directive('localStream', ['$window', function localStreamDirective($window) {

        // Ensure we're providing cross-browser support.
        $navigator.getUserMedia = $navigator.getUserMedia || $navigator.webkitGetUserMedia || $navigator.mozGetUserMedia;
        var url                 = $window.URL || $window.webkitURL;

        return {

            /**
             * @property scope
             * @type {Object}
             */
            scope: {
                localStream: '=ngModel'
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

                    videoElement.attr('src', url ? url.createObjectURL(stream) : stream);

                }, function onError(error) {

                    // An error was thrown when attempting to retrieve the local stream.
                    scope.error = 'Failed to retrieve local stream: ' + error;

                });

            }

        };

    }]);

})(window.angular.module(APP_NAME), window.navigator);
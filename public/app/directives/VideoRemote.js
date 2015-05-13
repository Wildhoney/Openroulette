/**
 * @module Openroulette
 * @submodule LocalStream
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module) {

    "use strict";

    /**
     * @directive videoRemote
     */
    $module.directive('videoRemote', ['$window', function videoRemoteDirective($window) {

        // Ensure we're supporting as many browsers as possible.
        var url = $window.URL || $window.webkitURL;

        return {

            /**
             * @property scope
             * @type {Object}
             */
            scope: {
                remoteStream: '=ngModel',
                error: '=',
                aspectRatio: '='
            },

            /**
             * @property templateUrl
             * @type {String}
             */
            templateUrl: 'partials/directive/video-remote.html',

            /**
             * @method link
             * @param scope {Object}
             * @param element {angular.element}
             * @return {void}
             */
            link: function link(scope, element) {

                /**
                 * @method changeAspectRatio
                 * @param aspectRatio {String}
                 * @return {void}
                 */
                var changeAspectRatio = function changeAspectRatio(aspectRatio) {

                    /**
                     * @method getMaxHeight
                     * @return {Number}
                     */
                    var getMaxHeight = function getMaxHeight() {
                        return element.parents('ng-include').height();
                    };

                    var includeElement = element.parents('section.group'),
                        ratioRegex     = String(aspectRatio).match(/([0-9]+):([0-9]+)/i),
                        maxWidth       = includeElement.width(),
                        videoWidth     = ((maxWidth / 100) * 80) - 100;

                    var videoElement   = element.find('video'),
                        heightRatio    = videoWidth * parseInt(ratioRegex[2]) / parseInt(ratioRegex[1]);

                    videoElement.width(videoWidth);
                    videoElement.height(heightRatio);

                    if (heightRatio > getMaxHeight()) {
                        videoElement.height(getMaxHeight());
                        videoElement.width(getMaxHeight() / parseInt(ratioRegex[2]) * parseInt(ratioRegex[1]));
                    }

                };

                scope.$watch('aspectRatio', function aspectRatioChanged() {
                    changeAspectRatio(scope.aspectRatio);
                });

                angular.element($window).bind('resize', function onResize() {
                    changeAspectRatio(scope.aspectRatio);
                    scope.$apply();
                });

                scope.$watch('remoteStream', function onRemoteStream() {

                    var streamSource = url ? url.createObjectURL(scope.remoteStream) : scope.remoteStream;
                    element.find('video').attr('src', streamSource);

                });

            }

        };

    }]);

})(window.angular.module(APP_NAME), window.navigator);
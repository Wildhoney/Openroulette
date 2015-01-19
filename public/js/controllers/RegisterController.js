/**
 * @module Openroulette
 * @submodule RegisterController
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module) {

    "use strict";

    /**
     * @controller RegisterController
     */
    $module.controller('RegisterController', ['$scope', '$localStorage', 'socket', 'peer',

    function RegisterController($scope, $localStorage, socket, peer) {

        /**
         * @constant STATUS_CODES
         * @type {Object}
         */
        $scope.STATUS_CODES = { IDLE: 1, CONNECTING: 2, CONNECTED: 4 };

        /**
         * @property status
         * @type {Number}
         */
        $scope.status = $scope.STATUS_CODES.IDLE;

        /**
         * @property alias
         * @type {String}
         */
        $scope.alias = $localStorage.getItem('alias') || '';

        /**
         * Determines whether we have a local stream of the user's video.
         *
         * @property localStream
         * @type {Boolean}
         */
        $scope.localStream = false;

        /**
         * @property randomName
         * @type {String}
         */
        $scope.randomName = (function randomName() {

            var names = ['Sarah Palin', 'Vladimir Putin', 'David Hasselhoff', 'Rick Astley'];
            return names[Math.floor(Math.random() * names.length)];

        }());

        /**
         * Used to determine if all the conditions have been set to begin a chat session, with the user's
         * video and their alias defined.
         *
         * @method isReady
         * @return {Boolean}
         */
        $scope.isReady = function isReady() {
            return ($scope.localStream && $scope.alias);
        };

        /**
         * @method isStatus
         * @param expectedStatus
         */
        $scope.isStatus = function isStatus(expectedStatus) {
            return ($scope.status & expectedStatus);
        };

        /**
         * @method initialise
         * @property alias {String}
         * @return {void}
         */
        $scope.initialise = function initialise(alias) {

            if (alias && $scope.localStream) {

                $scope.status = $scope.STATUS_CODES.CONNECTING;
                $localStorage.setItem('alias', alias);
                peer.establishConnection();

            }

        };

        /**
         * @method beginSession
         * @return {void}
         */
        $scope.beginSession = function beginSession() {

            if (typeof $scope.registerStream === 'function') {
                $scope.registerStream($scope.localStream);
            }

            if (typeof $scope.registerAlias === 'function') {
                $scope.registerAlias($scope.alias);
            }

        };

        // Listen for when the user accepts their camera usage.
        $scope.$on('web-rtc/allowed-camera', function onAllowedCamera(event, streamSource) {

            $scope.localStream = streamSource;

            if ($scope.alias) {

                // Automatically begin the Openroulette session if an alias has already been defined.
                $scope.initialise($scope.alias);

            }

        });

        // Listen for once we have established a RTC connection.
        $scope.$on('web-rtc/connected', function onPeerConnected(event, peerData) {

            // Register the alias and the peer ID with our MongoDB server.
            socket.emit('web-socket/register', { alias: $scope.alias, sessionId: peerData.id });
            $scope.beginSession();

        });

    }]);

})(window.angular.module(APP_NAME));
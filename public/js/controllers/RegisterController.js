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
    $module.controller('RegisterController', ['$scope', '$localStorage', 'socket',

    function RegisterController($scope, $localStorage, socket) {

        /**
         * @property alias
         * @type {String}
         */
        $scope.alias = $localStorage.getItem('alias') || '';

        /**
         * @property randomName
         * @type {String}
         */
        $scope.randomName = function randomName() {

            var names = ['Sarah Palin', 'Vladimir Putin', 'David Hasselhoff', 'Rick Astley'];
            return names[Math.floor(Math.random() * names.length)];

        }();

        /**
         * @method registerAlias
         * @param alias {String}
         * @return {void}
         */
        $scope.registerAlias = function registerAlias(alias) {

            if (alias && $scope.session.localStream) {

                // Define alias as part of the session and register in MongoDB.
                $scope.session.alias = alias;
                $localStorage.setItem('alias', alias);

            }

        };

        // Listen for when the user accepts their camera usage.
        $scope.$on('web-rtc/allowed-camera', function onAllowedCamera() {

            if ($scope.alias) {

                // Automatically begin the Openroulette session if an alias has already been defined.
                $scope.registerAlias($scope.alias);

            }

        });

        // Listen for once we have established a RTC connection.
        $scope.$on('web-socket/connected', function onPeerConnected(event, peerData) {

            // Register the alias and the peer ID with our MongoDB server.
            socket.emit('web-socket/register', { alias: $scope.alias, sessionId: peerData.id });

        });

    }]);

})(window.angular.module(APP_NAME));
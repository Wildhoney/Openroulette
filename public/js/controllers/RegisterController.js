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
    $module.controller('RegisterController', ['$scope', 'socket', function RegisterController($scope, socket) {

        /**
         * @property alias
         * @type {String}
         */
        $scope.alias = '';

        /**
         * @method registerAlias
         * @param alias {String}
         * @return {void}
         */
        $scope.registerAlias = function registerAlias(alias) {

            if (alias && $scope.session.localStream) {

                // Define alias as part of the session and register in MongoDB.
                $scope.setAlias(alias);

            }

        };

        // Listen for once we have established a RTC connection.
        $scope.$on('peer/connected', function onPeerConnected(event, peerData) {

            // Register the alias and the peer ID with our MongoDB server.
            socket.emit('client/register', { alias: $scope.alias, sessionId: peerData.id });

        });

    }]);

})(window.angular.module(APP_NAME));
/**
 * @module Openroulette
 * @submodule VideoController
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module) {

    "use strict";

    /**
     * @controller VideoController
     */
    $module.controller('VideoController', ['$scope', 'socket', 'peer', function VideoController($scope, socket, peer) {

        /**
         * @property aspectRatio
         * @type {String}
         */
        $scope.aspectRatio = '4:3';

        /**
         * @property clientModel
         * @type {Object}
         */
        $scope.clientModel = { alias: '' };

        /**
         * @method setupCall
         * @param callerId {String}
         * @return {void}
         */
        var setupCall = function setupCall(callerId) {

            var call = peer.getPeer().call(callerId, $scope.session.localStream);

            call.on('stream', function(stream) {

                // Hook up the remote stream once we've started to receive it.
                $scope.remoteStream = stream;
                console.log($scope.remoteStream);
                $scope.$apply();

            });

        };

        /**
         * @method findClient
         * @return {void}
         */
        var findClient = function findClient() {

            // Find a person to communicate with!
            socket.emit('web-socket/find', { exclude: peer.getPeer().id });

        };

        //socket.on('web-socket/register'

        // Listen for when Openroulette is ready to begin streaming.
        $scope.$on('openroulette/ready', function onOpenrouletteReady() {

            findClient();

            // Once we've connected to our client!
            socket.on('web-socket/client', function onClient(clientModel) {

                if (!clientModel) {

                    // Client could not be found so we'll keep emitting.
                    findClient();
                    return;

                }

                if (!$scope.clientModel.alias) {
                    $scope.clientModel = clientModel;
                    setupCall(clientModel.sessionId);
                    $scope.$apply();
                }

            });

            peer.getPeer().on('call', function(call) {

                // Answer every call automatically.
                call.answer($scope.session.localStream);

            });

        });

    }]);

})(window.angular.module(APP_NAME));
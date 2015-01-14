/**
 * @module Openroulette
 * @submodule ApplicationController
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module, $navigator) {

    "use strict";

    /**
     * @controller ApplicationController
     */
    $module.controller('ApplicationController', ['$scope', 'peer',

    function ApplicationController($scope, peer) {

        /**
         * @property peer
         * @type {Object}
         */
        $scope.peer = peer;

        /**
         * @property localStream
         * @type {MediaStream}
         */
        $scope.localStream = {};

        /**
         * Once the Peer client has successfully connected to the WebRTP service.
         *
         * @event peer/connected
         */
        $scope.$on('peer/connected', function onPeerConnected(event, peerId) {

            console.log(peerId);

        });

    }]);

})(window.angular.module(APP_NAME), window.navigator);
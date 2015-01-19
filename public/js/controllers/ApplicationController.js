/**
 * @module Openroulette
 * @submodule ApplicationController
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module) {

    "use strict";

    /**
     * @controller ApplicationController
     */
    $module.controller('ApplicationController', ['$scope', 'peer', function ApplicationController($scope, peer) {

        /**
         * @property session
         * @type {Object}
         */
        $scope.session = { alias: '', peer: {}, localStream: null, status: peer.getStatus(), CODES: peer.CODES };

        /**
         * @property metaData
         * @type {Object}
         */
        $scope.metaData = { clientCount: 0 };

        /**
         * @method isConnected
         * @return {Boolean}
         */
        $scope.isConnected = function isConnected() {
            return $scope.isPeer($scope.session.CODES.CONNECTED);
        };

        /**
         * @method isPeer
         * @param validateStatusCode {Number}
         * @return {Boolean}
         */
        $scope.isPeer = function isPeer(validateStatusCode) {
            return !!(peer.getStatus() & validateStatusCode);
        };

        /**
         * @method setClientsCount
         * @param count {Number}
         * @return {void}
         */
        $scope.setClientsCount = function setClientsCount(count) {
            $scope.metaData.clientCount = count;
        };

        // Listen for once we have established a RTC connection.
        $scope.$on('web-socket/connected', function onPeerConnected(event, peerData) {

            $scope.session.peer   = peerData;
            $scope.session.status = peer.getStatus();

        });

        $scope.$watch('session.alias', function userAliasChanged() {

            var alias = $scope.session.alias;

            if (alias) {

                // Establish the RTC connection.
                peer.establishConnection();
                $scope.session.status = peer.getStatus();

            }

        });

    }]);

})(window.angular.module(APP_NAME));
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
    $module.controller('ApplicationController', ['$scope', 'peer', function ApplicationController($scope, peer) {

        /**
         * @property session
         * @type {Object}
         */
        $scope.session = { alias: '', peer: {}, localStream: null, status: peer.getStatus(), CODES: peer.CODES };

        /**
         * @method isReady
         * @return {Boolean}
         */
        $scope.isReady = function isReady() {
            return ('alias' in $scope.session);
        };

        /**
         * @method isPeer
         * @param validateStatusCode {Number}
         * @return {Boolean}
         */
        $scope.isPeer = function isPeer(validateStatusCode) {
            return !!(peer.getStatus() & validateStatusCode);
        };

        $scope.$watch('session.alias', function userAliasChanged() {

            var alias = $scope.session.alias;

            if (alias) {

                // Establish the RTC connection.
                peer.establishConnection();
                $scope.session.status = peer.getStatus();

                // Listen for once we have established a RTC connection.
                $scope.$on('peer/connected', function onPeerConnected(event, peerData) {
                    $scope.session.peer   = peerData;
                    $scope.session.status = peer.getStatus();
                });

            }

        });

    }]);

})(window.angular.module(APP_NAME), window.navigator);
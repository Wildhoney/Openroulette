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
    $module.controller('ApplicationController', ['$scope', function ApplicationController($scope) {

        /**
         * @property session
         * @type {Object}
         */
        $scope.session = { alias: '', localStream: null };

        /**
         * @method registerAlias
         * @param alias {String}
         * @return {void}
         */
        $scope.registerAlias = function registerAlias(alias) {
            $scope.session.alias = alias;
        };

        /**
         * @method registerStream
         * @param streamUrl {String}
         * @return {void}
         */
        $scope.registerStream = function registerStream(streamUrl) {
            $scope.session.localStream = streamUrl;
        };

        /**
         * @method isReady
         * @return {Boolean}
         */
        $scope.isReady = function isReady() {
            return ($scope.session.alias && $scope.session.localStream);
        };

    }]);

})(window.angular.module(APP_NAME));
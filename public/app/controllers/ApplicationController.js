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
         * @method registerProperties
         * @param properties {Object}
         * @return {void}
         */
        $scope.registerProperties = function registerProperties(properties) {

            Object.keys(properties).forEach(function forEach(property) {
                $scope.session[property] = properties[property];
            });

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
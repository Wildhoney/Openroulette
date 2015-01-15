/**
 * @module Openroulette
 * @submodule RegisterController
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module, $navigator) {

    "use strict";

    /**
     * @controller RegisterController
     */
    $module.controller('RegisterController', ['$scope', function RegisterController($scope) {

        /**
         * @method registerAlias
         * @param alias {String}
         * @return {void}
         */
        $scope.registerAlias = function registerAlias(alias) {

            if (alias && $scope.session.localStream) {

                $scope.$parent.session.alias = alias;

            }

        };

    }]);

})(window.angular.module(APP_NAME), window.navigator);
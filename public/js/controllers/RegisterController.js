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
    $module.controller('RegisterController', ['$scope', function RegisterController($scope) {

        /**
         * @method registerAlias
         * @param alias {String}
         * @return {void}
         */
        $scope.registerAlias = function registerAlias(alias) {

            if (alias && $scope.session.localStream) {

                // Define alias as part of the session.
                $scope.setAlias(alias);

            }

        };

    }]);

})(window.angular.module(APP_NAME));
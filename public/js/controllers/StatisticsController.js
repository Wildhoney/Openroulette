/**
 * @module Openroulette
 * @submodule StatisticsController
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module) {

    "use strict";

    /**
     * @controller StatisticsController
     */
    $module.controller('StatisticsController', ['$scope', 'socket', function StatisticsController($scope, socket) {

        // Listen for data on how many connected users we currently have.
        socket.on('web-socket/client-count', function onMetaClientCount(properties) {
            $scope.setClientsCount(properties.clientCount);
            $scope.$apply();
        });

    }]);

})(window.angular.module(APP_NAME));
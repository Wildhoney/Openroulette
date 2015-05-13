/**
 * @module Openroulette
 * @submodule Socket
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module) {

    "use strict";

    /**
     * @service socket
     */
    $module.service('socket', ['$io', 'SOCKET_PATH', function socketIoService($io, SOCKET_PATH) {

        var socket = $io(SOCKET_PATH);

        return {

            /**
             * @method emit
             * @param name {String}
             * @param [properties={}] {Object}
             * @return {void}
             */
            emit: function emit(name, properties) {
                socket.emit(name, properties);
            },

            /**
             * @method on
             * @param name {String}
             * @param callbackFn {Function}
             * @return {void}
             */
            on: function on(name, callbackFn) {
                socket.on(name, callbackFn);
            }

        };

    }]);

})(window.angular.module(APP_NAME));
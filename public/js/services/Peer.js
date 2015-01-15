/**
 * @module Openroulette
 * @submodule Peer
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module) {

    "use strict";

    /**
     * @constant CODES
     * @type {Object}
     */
    var CODES = {
        DISCONNECTED: 1, CONNECTING: 2, CONNECTED: 4
    };

    /**
     * @property statusCode
     * @type {Number}
     */
    var statusCode = CODES.DISCONNECTED;

    /**
     * @service peer
     */
    $module.service('peer', ['PEERJS_API_KEY', '$rootScope', 'Peer', function peerService(PEERJS_API_KEY, $rootScope, Peer) {

        var peer;

        return {

            /**
             * @constant CODES
             * @type {Object}
             */
            CODES: CODES,

            /**
             * @method establishConnection
             * @return {Peer}
             */
            establishConnection: function establishConnection() {

                statusCode = CODES.CONNECTING;

                peer = new Peer({ key: PEERJS_API_KEY }).on('open', function onOpen() {

                    statusCode = CODES.CONNECTED;

                    $rootScope.$broadcast('peer/connected', peer);
                    $rootScope.$apply();

                }.bind(this));

            },

            /**
             * @method getStatus
             * @return {Number}
             */
            getStatus: function getStatus() {
                return statusCode;
            }

        };

    }]);

})(window.angular.module(APP_NAME));
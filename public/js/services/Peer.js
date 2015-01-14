/**
 * @module Openroulette
 * @submodule Peer
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($module, $Peer) {

    "use strict";

    /**
     * @constant CODES
     * @type {Object}
     */
    var CODES = {
        DISCONNECTED: 1, CONNECTING: 2, CONNECTED: 4
    };

    /**
     * @service peer
     */
    $module.service('peer', ['PEERJS_API_KEY', '$rootScope', function peerService(PEERJS_API_KEY, $rootScope) {

        var peer       = new Peer({ key: PEERJS_API_KEY }),
            statusCode = CODES.CONNECTING,
            peerId     = null;

        peer.on('open', function onOpen(id) {

            // Voila!
            peerId     = id;
            statusCode = CODES.CONNECTED;

            $rootScope.$broadcast('peer/connected', peerId);
            $rootScope.$apply();

        });

        return {

            /**
             * @constant CODES
             * @type {Object}
             */
            CODES: CODES,

            /**
             * @method getStatus
             * @return {Number}
             */
            getStatus: function getStatus() {
                return statusCode;
            },

            /**
             * @method getPeerId
             * @return {Number}
             */
            getPeerId: function getPeerId() {
                return peerId;
            },

            /**
             * @method is
             * @param validateStatusCode {Number}
             * @return {Boolean}
             */
            is: function is(validateStatusCode) {
                return !!(statusCode & validateStatusCode);
            }

        };

    }]);

})(window.angular.module(APP_NAME), window.Peer);
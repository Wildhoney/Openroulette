/**
 * @constant APP_NAME
 * @type {String}
 */
var APP_NAME = 'openrouletteApp';

/**
 * @module Openroulette
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Openroulette
 */
(function main($window) {

    "use strict";

    // Tout est pardonné...
    var module = $window.angular.module(APP_NAME, [])
                        .constant('PEERJS_API_KEY', 'drp64kt0018umcxr')
                        .constant('SOCKET_PATH', 'http://localhost:5000/');

    /**
     * @method registerThirdPartyModules
     * @return {void}
     */
    (function registerThirdPartyModules() {

        module.factory('$io', function registerSocketIo() {
            return $window.io || $window.angular.noop;
        });

        module.factory('$navigator', function registerNavigator() {
            return $window.navigator || {};
        });

        module.factory('Peer', function registerPeer() {
            return $window.Peer || {};
        });

    })();


})(window);
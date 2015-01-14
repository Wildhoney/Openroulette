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
(function main($angular) {

    "use strict";

    // Tout est pardonné...
    $angular.module(APP_NAME, [])
        .constant('PEERJS_API_KEY', 'drp64kt0018umcxr')
        .constant('SOCKET_PATH', 'http://localhost:5000/');

})(window.angular);
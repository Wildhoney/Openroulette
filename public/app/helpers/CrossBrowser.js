export default (() => {

    "use strict";

    return {

        /**
         * @method getUserMedia
         * @param {Object} options
         * @param {Function} successFn
         * @param {Function} errorFn
         * @return {Object}
         */
        getUserMedia(options, successFn, errorFn) {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            navigator.getUserMedia(options, successFn, errorFn);
        }

    }

})();
(function($process) {

    "use strict";

    var express     = require('express'),
        app         = express(),
        server      = require('http').createServer(app);

    app.use(express.static(__dirname + '/../public'));
    server.listen($process.env.PORT || 5000);

})(process);
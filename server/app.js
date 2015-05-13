(function main($process) {

    "use strict";

    /**
     * @constant OPTIONS_PATH
     * @type {String}
     */
    var OPTIONS_PATH = __dirname + '/../options.yml';

    var fs   = require('fs'),
        yaml = require('js-yaml');

    /**
     * @property {Object} config
     * @property {String} config.components
     */
    var config = yaml.safeLoad(fs.readFileSync(OPTIONS_PATH, 'utf8'));

    var express     = require('express'),
        app         = express(),
        server      = require('http').createServer(app),
        io          = require('socket.io').listen(server),
        mongoUrl    = $process.env.MONGO_URL || config.node.mongo.path,
        MongoClient = require('mongodb').MongoClient,
        assert      = require('assert');

    app.use(express.static(__dirname + '/../public'));
    server.listen($process.env.PORT || 5000);

    MongoClient.connect(mongoUrl, function onConnect(error, db) {

        // Assert that we have zero errors!
        assert.equal(null, error);

        /**
         * @on connection
         */
        io.sockets.on('connection', function (socket) {

            var usersCollection = db.collection(config.node.mongo.database);

            /**
             * @method numberOfConnectedClients
             * @return {void}
             */
            (function numberOfConnectedClients() {

                /**
                 * Responsible for determining how many currently connected clients there are.
                 *
                 * @method countUsers
                 * @return {void}
                 */
                function countUsers() {

                    usersCollection.count(function onCount(error, result) {
                        socket.emit('web-socket/client-count', { clientCount: result });
                    });

                }

                countUsers();
                setInterval(countUsers, config.node.client_count_refresh);

            })();

            socket.on('web-socket/register', function clientRegister(properties) {

                var model = { alias: properties.alias, sessionId: properties.sessionId, isBusy: false, lastPing: new Date() };

                usersCollection.insert([model], function onInsert(error) {
                    assert.equal(error, null);
                });

            });

            socket.on('web-socket/find', function findPartner(properties) {

                var exclude = properties.exclude || '',
                    query   = { isBusy: false, sessionId: { $ne: exclude } };

                usersCollection.count(query, function onCount(error, count) {

                    var options = { limit: 1, skip: Math.floor(Math.random() * count) };

                    if (count === 0) {
                        socket.emit('web-socket/client', null);
                        return;
                    }

                    usersCollection.find(query, options).toArray(function onResult(error, result) {
                        socket.emit('web-socket/client', { alias: result[0].alias, sessionId: result[0].sessionId });
                    });

                });

            });

        });

    });

})(process);
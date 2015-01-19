(function main($angular, $localStorage) {

    beforeEach(module('openrouletteApp'));

    afterEach(function afterEach() {
        $localStorage.clear()
    });

    /**
     * @property PeerServiceMock
     * @type {Object}
     */
    var PeerServiceMock = {

        /**
         * @constant CODES
         * @type {Object}
         */
        CODES: { DISCONNECTED: 1, CONNECTING: 2, CONNECTED: 4 },

        /**
         * @property statusCode
         * @type {Number}
         */
        statusCode: 1,

        /**
         * @method getStatus
         * @return {Number}
         */
        getStatus: function getStatus() {
            return this.statusCode;
        },

        /**
         * @method establishConnection
         * @return {void}
         */
        establishConnection: function establishConnection() {

            this.statusCode = this.CODES.CONNECTING;
            var $self       = this;

            inject(function($rootScope, $timeout) {

                // Mimic latency.
                $timeout(function() {

                    $self.statusCode = $self.CODES.CONNECTED;
                    $rootScope.$broadcast('web-rtc/connected', { id: 5 });

                });

            });

        }

    };

    /**
     * @property SocketServiceMock
     * @type {Object}
     */
    var SocketServiceMock = {

        /**
         * @property events
         * @type {Object}
         */
        events: {},

        /**
         * @method emit
         * @param eventName {String}
         * @param properties {Object}
         * @return {void}
         */
        emit: function emit(eventName, properties) {},

        /**
         * @method on
         * @param eventName {String}
         * @param callbackFn {Function}
         * @return {void}
         */
        on: function on(eventName, callbackFn) {

            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }

            this.events[eventName].push(callbackFn);

        },

        /**
         * @method testOn
         * @param eventName {String}
         * @param params {Array}
         * @return {void}
         */
        testOn: function testOn(eventName, params) {

            if (this.events[eventName]) {

                this.events[eventName].forEach(function forEach(event) {
                    event.apply(event, params);
                });

            }

        }

    };

    /**
     * @method createController
     * @param name {String}
     * @param [dependencies={}] {Object}
     * @return {Object}
     */
    var createController = function createController(name, dependencies) {

        var controller = null;
        dependencies   = dependencies || {};

        inject(function inject($rootScope, $controller) {

            dependencies.$scope = controller = $rootScope.$new();
            $controller(name, dependencies);
            controller.$digest();

        });

        return controller;

    };

    describe('ApplicationController', function() {

        var localStreamUrl = 'http://www.example.com/stream';

        beforeEach(function beforeEach() {

            var controller = createController('ApplicationController');
            expect(controller.session.alias).toEqual('');
            expect(controller.session.localStream).toBeNull();
            expect(controller.isReady()).toBeFalsy();

        });

        it('Should be able to register a local video stream and alias;', function() {

            var controller = createController('ApplicationController');

            controller.registerAlias('Adam');
            expect(controller.session.alias).toEqual('Adam');
            expect(controller.session.localStream).toBeNull();
            expect(controller.isReady()).toBeFalsy();

            controller.registerStream(localStreamUrl);
            expect(controller.session.alias).toEqual('Adam');
            expect(controller.session.localStream).toEqual(localStreamUrl);
            expect(controller.isReady()).toBeTruthy();

        });

    });

    describe('RegisterController', function() {

        var localStreamUrl = 'http://www.example.com/stream';

        it('Should be able to wait for all conditions to be satisfied before initiating the session;', inject(function($rootScope, $timeout) {

            var controller = createController('RegisterController', { peer: PeerServiceMock, socket: SocketServiceMock });

            expect(controller.isReady()).toBeFalsy();
            expect(controller.localStream).toBeFalsy();
            expect(controller.alias).toEqual('');
            expect(controller.status).toEqual(controller.STATUS_CODES.IDLE);

            // Camera stream has now been enabled.
            $rootScope.$broadcast('web-rtc/allowed-camera', localStreamUrl);
            expect(controller.localStream).toEqual(localStreamUrl);
            expect(controller.alias).toEqual('');
            expect(controller.isReady()).toBeFalsy();
            expect(controller.status).toEqual(controller.STATUS_CODES.IDLE);

            // Once the camera stream has been established, and an alias has been defined, then
            // sessions are allowed to begin.
            controller.alias = 'Adam';
            expect(controller.isReady()).toBeTruthy();
            expect(controller.status).toEqual(controller.STATUS_CODES.IDLE);

            // Button has now been pressed which means we can initiate the session!
            controller.initialise(controller.alias);
            expect(controller.status).toEqual(controller.STATUS_CODES.CONNECTING);

            // Mock the methods that normally exist on the parent controller.
            controller.registerStream = $angular.noop;
            controller.registerAlias  = $angular.noop;
            spyOn(controller, 'registerStream');
            spyOn(controller, 'registerAlias');

            // Next step is for the Web RTC connection to be established.
            spyOn(SocketServiceMock, 'emit').and.callThrough();
            $timeout.flush();
            expect(SocketServiceMock.emit).toHaveBeenCalled();
            expect(controller.registerStream).toHaveBeenCalledWith(localStreamUrl);
            expect(controller.registerAlias).toHaveBeenCalledWith('Adam');

        }));

        it('Should be able to initiate aliased session when the camera stream has been accepted;', inject(function($rootScope) {

            var controller = createController('RegisterController', { peer: PeerServiceMock, socket: SocketServiceMock });

            // Define the alias before the camera stream has been accepted.
            controller.alias = 'Adam';

            // Once the camera has been accepted, then because the alias been pre-defined, the user should automatically
            // be thrown into the session because all conditions have been satisfied.
            spyOn(controller, 'initialise').and.callThrough();
            $rootScope.$broadcast('web-rtc/allowed-camera', localStreamUrl);
            expect(controller.initialise).toHaveBeenCalled();

        }));

        it('Should be able to assign a random name for suggestion;', function() {

            var controller = createController('RegisterController', { peer: PeerServiceMock, socket: SocketServiceMock });
            expect(typeof controller.randomName).toBe('string');

        });

    });

    describe('StatisticsController', function() {

        it('Should be able to listen for a WebSocket event for the count;', function() {

            var controller    = createController('StatisticsController', { socket: SocketServiceMock }),
                expectedCount = 15;

            // Mock the session object that handles the count -- usually on the parent controller -- but in this
            // case on our isolated controller for testing purposes.
            controller.session = { clientCount: 0 };
            SocketServiceMock.testOn('web-socket/client-count', [{ clientCount: expectedCount }]);
            expect(controller.session.clientCount).toEqual(expectedCount);

        });

    });

})(window.angular, window.localStorage);
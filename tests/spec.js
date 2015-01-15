(function main($angular) {

    beforeEach(module('openrouletteApp'));

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
                    $rootScope.$broadcast('peer/connected');

                });

            });

        }

    };

    /**
     * @method createController
     * @param name {String}
     * @param [dependencies={}] {Object}
     * @return {Object}
     */
    var createController = function createController(name, dependencies) {

        var scope    = null;
        dependencies = dependencies || {};

        inject(function inject($rootScope, $controller) {

            dependencies.$scope = scope = $rootScope.$new();
            $controller(name, dependencies);
            scope.$digest();

        });

        return scope;

    };

    describe('ApplicationController', function() {

        it('Should be able to create an empty session object;', function() {

            var scope = createController('ApplicationController', { peer: PeerServiceMock });

            expect(scope.session.status).toEqual(1);
            expect(scope.session.alias).toEqual('');
            expect(scope.session.localStream).toBeNull();
            expect(typeof scope.session.peer).toBe('object');
            expect(typeof scope.session.CODES).toBe('object');

        });

        it('Should be able to establish a WebRTC connection;', function() {

            var scope = createController('ApplicationController', { peer: PeerServiceMock });
            spyOn(PeerServiceMock, 'establishConnection').and.callThrough();

            expect(scope.session.status).toEqual(1);
            scope.session.alias = 'Adam';
            scope.$digest();
            expect(PeerServiceMock.establishConnection).toHaveBeenCalled();
            expect(scope.session.status).toEqual(2);

            inject(function($timeout) {

                $timeout.flush();
                expect(scope.session.status).toEqual(4);

            });

        });

    });

    describe('RegisterController', function() {

        it('Should be able to define the alias for the session;', function() {

            var scope = createController('RegisterController');

            (function setupParentMocks() {

                // Mock the properties.
                scope.alias   = '';
                scope.session = { localStream: {} };

                // Mock the setAlias method that is a part of the $parent.
                scope.setAlias = function setAliasMock(alias) {
                    scope.alias = alias;
                };

            })();

            expect(scope.alias).toEqual('');
            scope.registerAlias('Adam');
            expect(scope.alias).toEqual('Adam');

        });

    });

})(window.angular);
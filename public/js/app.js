'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            // .when('/routeName', {
            //     templateUrl: 'partials/viewName',
            //     controller: ControllerName
            // })
            // .when('/routeName', {
            //     templateUrl: 'partials/viewName',
            //     controller: ControllerName
            // })
            // .otherwise({
            //     redirectTo: '/'
            // });
        $locationProvider.html5Mode(true);
    }]);
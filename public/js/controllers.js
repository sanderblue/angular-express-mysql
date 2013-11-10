'use strict';

/* Controllers */

function RegistrationCtrl($scope, $http) {
    $scope.master= {};

    $scope.clearFields = function() {
        $scope.user = {};
    };

    $scope.user = {};

    $scope.register = function() {

        console.log('USER DATA FROM CLIENT: ', $scope.user);

        $scope.codeStatus = '';

        $http({
            method : 'POST',
            url : 'http://localhost:3000/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data : $scope.user
        })
        .success(function(response) {
            // Getting Success Response in Callback
            console.log('Success: ', response);

            $scope.username = response.username;
            $scope.codeStatus = response;

            $('#myModal').modal('toggle');
            $('.alert').fadeIn();
        })
        .error(function(response) {
            // Getting Error Response in Callback
            $scope.codeStatus = response || 'Request failed';

            console.log('Error status', $scope.codeStatus);
        });

        $scope.clearFields();
    }

    $scope.list = function() {

        console.log('Listing fired!')

        var url = 'http://localhost:3000/register'; // URL where our Node.js server is running

        $http.get(url).success(function(data) {
            $scope.users = data;

            console.log('Scope users: ', $scope.users);
        });
        // Accessing the Angular $http Service to get data via REST Communication from Node Server
    };
}

function RestrictedCtrl($scope, $http) {
    console.log('Test',$scope);

    $http.get('/restricted')
    .success(function(data, status, headers, config) {
        console.log("Logged in?", data, status, headers, config)
    })
    .error(function(err) { 
        console.log(err);
    });
}

function LoginController($scope, $http, $location) {
    $scope.user = {};

    $scope.clearFields = function() {
        $scope.user = {};
    };

    $scope.login = function() {
        $http.post('/login', $scope.user)
        .success(function(res) {
            
            console.log("SUCCESS Login Response: ", res);    

            $location.url('/restricted');
        })
        .error(function(err) {
            console.error('ERROR: ', err);
        });
    };
}

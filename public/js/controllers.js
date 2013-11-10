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
            method: 'POST',
            url: 'http://localhost:3000/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: $scope.user
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
}

function LoginController($scope, $http, $location) {
    $scope.clearFields = function() {
        $scope.user = {};
    };

    $scope.login = function() {
        $http.post('/login', $scope.user)
        .success(function(res) {
            console.log("SUCCESS Login Response: ", res);
            
            $scope.user = res.data;

            window.location = res.route;
        })
        .error(function(err) {
            console.error('ERROR: ', err);
        });
    };
}

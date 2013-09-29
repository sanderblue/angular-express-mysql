'use strict';

/* Controllers */

function RegistrationCtrl($scope, $http) {
    $scope.master= {};

    $scope.clearFields = function() {
        $scope.user = angular.copy($scope.master);
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

            $('#myModal').modal('toggle');
            $('.alert').fadeIn();

            $scope.codeStatus = response;

        })
        .error(function(response) {
            // Getting Error Response in Callback

            $scope.codeStatus = response || 'Request failed';

            console.log('Error status', $scope.codeStatus);
        });

        // $scope.clearFields();
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

function IndexCtrl($scope, $http) {
    $http.get('/api/posts').success(function(data, status, headers, config) {
        $scope.posts = data.posts;
    });
}

function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};

  $scope.submitPost = function () {
        $http.post('/api/post', $scope.form).
        success(function(data) {
            $location.path('/');
        });
    };
}

function ReadPostCtrl($scope, $http, $routeParams) {
    $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
        $scope.post = data.post;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
    $scope.form = {};

    $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
        $scope.form = data.post;
    });

    $scope.editPost = function () {
        $http.put('/api/post/' + $routeParams.id, $scope.form).
        success(function(data) {
            $location.url('/readPost/' + $routeParams.id);
        });
    };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
        $scope.post = data.post;
    });

    $scope.deletePost = function () {
        $http.delete('/api/post/' + $routeParams.id).
            success(function(data) {
            $location.url('/');
        });
    };

    $scope.home = function () {
        $location.url('/');
    };
}

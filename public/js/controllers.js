'use strict';

/* Controllers */

function RegistrationCtrl($scope, $http) {
    $scope.master= {};

    $scope.update = function(user) {
        $scope.master= angular.copy(user);
    };

    $scope.reset = function() {
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
        }).
        success(function(response) {
            console.log('success', response); // Getting Success Response in Callback

            $scope.codeStatus = response.data;

            console.log($scope.codeStatus);

        }).
        error(function(response) {
            console.log("error", response); // Getting Error Response in Callback

            $scope.codeStatus = response || "Request failed";

            console.log($scope.codeStatus);
        });

        // Calling the list function in Angular Controller to show all current data in HTML
        // $scope.list();

        $scope.reset();
    }

    // $scope.list = function() {
    //     var url = 'http://localhost:3000/register'; // URL where our Node.js server is running

    //     $http.get(url).success(function(data) {
    //         $scope.users = data;
    //     });
    //       // Accessing the Angular $http Service to get data via REST Communication from Node Server
    // };

    $scope.reset();
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

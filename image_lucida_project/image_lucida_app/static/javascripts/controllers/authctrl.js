"use strict";
myApp.controller("AuthCtrl", function($scope, $rootScope, $location, $window, $route, UserFactory){
    $scope.user = {};
    $scope.register = ()=>{
        console.log($scope.user);
        UserFactory.registerUser($scope.user).then( (response)=>{
            if (response[0]) {
                $scope.user = {};

                $rootScope.user_status = true;
                $location.path('#!/projects/');
            }
            else {
                console.log('register failed');
            }
        });
    };
    $scope.login = ()=>{
        UserFactory.loginUser($scope.user).then( (response)=>{
            if (response.user !== false) {
                $rootScope.user_status = true;
                console.log(response);
                $rootScope.username = response[0].fields.username;
                console.log($rootScope.username);
                $scope.user = {};
                // $location.path('/projects');
                $window.location.replace('#!/projects');
            }
            else {
                console.log('login failed', response);
            }
        });
    };
    if($location.path()=== "/logout"){
        UserFactory.logoutUser().then( (response)=>{
            console.log(response);
            if (response.logout) {
                $rootScope.user_status = false;
                $scope.user = {};
                $location.path('#!/');
            }
            else {
                console.log('logout failed');
            }
        });
    }
});

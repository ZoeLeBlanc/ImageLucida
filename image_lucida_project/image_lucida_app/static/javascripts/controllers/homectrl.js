"use strict";
myApp.controller("HomeCtrl", function($scope, $location, UserFactory){
    UserFactory.authUser().then( (response)=>{
        $scope.user = response;
    });
});
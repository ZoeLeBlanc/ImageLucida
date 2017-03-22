"use strict";
myApp.controller("NavCtrl", function($scope, $rootScope, $location, UserFactory){
    UserFactory.authUser().then( (response)=>{
        console.log(response);
        $rootScope.user_status = response;
    });
});
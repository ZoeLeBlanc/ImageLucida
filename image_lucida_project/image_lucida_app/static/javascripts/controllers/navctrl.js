"use strict";
myApp.controller("NavCtrl", function($scope, $rootScope, $location, UserFactory){
    UserFactory.authUser().then( (response)=>{
        console.log(response);
        $rootScope.user_status = response;
    });
    $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true, // Choose whether you can drag to open on touch screens,
        // onOpen: function(el) { /* Do Stuff* / }, // A function to be called when sideNav is opened
        // onClose: function(el) { /* Do Stuff* / }, // A function to be called when sideNav is closed
      }
    );
});

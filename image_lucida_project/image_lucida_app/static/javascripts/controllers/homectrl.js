"use strict";
myApp.controller("HomeCtrl", function($scope, $rootScope, $location, UserFactory){
    UserFactory.authUser().then( (response)=>{
        $scope.user = response;
    });
    $scope.reset = () =>{
        $rootScope.project_id = "";
        $rootScope.group_id = "";
        $rootScope.source_id = "";
        $rootScope.file_id = "";
        $rootScope.bucket_id = "";
        $rootScope.folder_id = "";
        $rootScope.selectedProject = '';
        $rootScope.$broadcast('selectedProject', '');
    };
});

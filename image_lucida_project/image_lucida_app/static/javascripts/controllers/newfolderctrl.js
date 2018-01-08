"use strict";
myApp.controller("NewFolderCtrl", function($scope, $rootScope, $location, $routeParams, $window, UserFactory, FoldersFactory){
    let current_location = $location.path();
    $scope.editing = false;
    $scope.createFolder ={};
    if (current_location.includes('edit-folder')){
        $scope.editing = true;
        let folder_id = $routeParams.folder_id;
        FoldersFactory.getSingleFolder(folder_id).then( (response)=>{
            let folder = JSON.parse(response.folder);
            $scope.createFolder = folder[0].fields;
            $scope.createFolder.id = folder[0].pk;
        });
    }

    $scope.createNewFolder = ()=>{
        $scope.createFolder.project_id = $rootScope.project_id;
        FoldersFactory.cuFolder($scope.createFolder).then( (response)=>{
            $location.path('#!/home/');
        });
    };
    $scope.deleteFolder = ()=>{
        FoldersFactory.deleteFolder($routeParams.folder_id).then( (response)=>{
            $location.path('#!/home/');
        });
    };
});

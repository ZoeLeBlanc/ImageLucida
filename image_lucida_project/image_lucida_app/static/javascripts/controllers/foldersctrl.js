"use strict";
myApp.controller("FoldersCtrl", function($scope, $rootScope, $location, $routeParams, $window, FoldersFactory){
    console.log($rootScope.folder_id);
    $scope.folders = [];
    var getFolders = (projectId) => {
        $scope.folders = [];
        FoldersFactory.getFolders(projectId).then( (response)=>{
            if (response.error === "No folders."){
                $scope.folders = [];
            } else {
                angular.forEach(response, (folder, index)=>{
                    folder.fields.id = folder.pk;
                    $scope.folders.push(folder.fields);
                });
            }
            console.log($scope.folders);
        });
    };

    $rootScope.$on('clickProject', (event, data)=>{
        $rootScope.project_id = data;
        getFolders(data);
    });
    $rootScope.$on('newFolder', (event, data)=>{
        getFolders($rootScope.project_id);
    });
    if ($rootScope.folder_id !== undefined){
        getFolders($rootScope.project_id);
        $scope.selectedFolder = $rootScope.folder_id;
    }
    $scope.clickFolder = (folderId) => {
        if (folderId.length>0){
            $rootScope.$broadcast('clickFolder', `${folderId}`);
        } else {
            $rootScope.folder_id = '';
        }
    };

});

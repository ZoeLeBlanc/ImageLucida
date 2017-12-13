"use strict";
myApp.controller("FoldersCtrl", function($scope, $rootScope, $location, $routeParams, $window, FoldersFactory){
    $scope.folders = [];
    $rootScope.$on('clickProject', (event, data)=>{
        $rootScope.project_id = data;
        FoldersFactory.getFolders($rootScope.project_id).then( (response)=>{
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
    });
    $scope.clickFolder = (folderId) => {
        $rootScope.$broadcast('clickFolder', `${folderId}`);
    };
    $scope.duplicateFolder = (folderId) =>{
        FoldersFactory.duplicateFolder(folderId).then( (response)=>{
            $window.location.reload();
        });
    };
    $scope.deleteFolder = (folderId)=>{
        FoldersFactory.deleteFolder(folderId).then( (response)=>{
            console.log(response);
            $window.location.reload();
        });
    };
});

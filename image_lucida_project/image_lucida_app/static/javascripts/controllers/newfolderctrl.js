"use strict";
myApp.controller("NewFolderCtrl", function($scope, $location, $routeParams, $window, UserFactory, FoldersFactory){
    $scope.tagsExist = false;
    $scope.createProject ={};
    $('.chips').material_chip();
    let project_id = $routeParams.id;
    console.log(project_id);
    if ($location.path().match('edit-folder')){
        $scope.editing = true;
    } else {
        $scope.editing = false;
    }

    $scope.createNewFolder = ()=>{
        $scope.tags = [];
        var data = $('.chips').material_chip('data');
        angular.forEach(data, (value, index)=>{
            console.log("data", data[index].tag);
            $scope.tags.push({
                'tag':data[index].tag,
            });
        }); 
        $scope.createFolder.tags = $scope.tags;
        $scope.createFolder.project = project_id;
        console.log($scope.createProject);
        FoldersFactory.newFolder($scope.createFolder).then( (response)=>{
            $window.history.back();
        });
    };

});
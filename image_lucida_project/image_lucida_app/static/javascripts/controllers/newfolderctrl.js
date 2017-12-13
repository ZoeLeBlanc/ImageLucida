"use strict";
myApp.controller("NewFolderCtrl", function($scope, $rootScope, $location, $routeParams, $window, UserFactory, FoldersFactory){
    let current_location = $location.path();
    $scope.tagsExist = false;
    $scope.editing = false;
    $scope.createFolder ={};
    console.log($routeParams);
    if (current_location.includes('edit-folder')){
        $('#tagsDiv').append(`<div class="chips chips-initial"></div>`);
        $scope.editing = true;
        let folder_id = $routeParams.folder_id;
        FoldersFactory.getSingleFolder(folder_id).then( (response)=>{
            let folder = JSON.parse(response.folder);
            let tags = JSON.parse(response.tags);
            console.log(JSON.parse(response.folder));
            $scope.createFolder = folder[0].fields;
            $scope.createFolder.id = folder[0].pk;
            let data = [];
            angular.forEach(tags, (item, index)=>{
                console.log(item);
                data.push({tag:item.fields.tag_name});
            });
            console.log(data);
            $('.chips-initial').material_chip({data});
            angular.forEach($scope.statuses, (status, index)=>{
                console.log(status);
                angular.forEach(status, (value, key)=>{
                    if ($scope.createFolder.status == key){
                        $scope.selectedStatus = value;
                        console.log(value);
                    }
                });
            });
        });
    }
    if (current_location.includes('new-folder')){
        $('#tagsDiv').append(`<div class="chips"></div>`);
        $('.chips').material_chip();
    }

    $scope.createNewFolder = ()=>{
        $scope.createFolder.project_id = $routeParams.id;
        $scope.tags = [];
        var data = $('.chips').material_chip('data');
        angular.forEach(data, (value, index)=>{
            console.log("data", data[index].tag);
            $scope.tags.push({
                'tag':data[index].tag,
            });
        });
        $scope.createFolder.tags = $scope.tags;

        console.log($rootScope.project_id);
        console.log($routeParams);
        console.log($scope.createFolder);
        if ($scope.editing === true){
            FoldersFactory.updateFolder($scope.createFolder).then( (response)=>{
            $location.path('#!/home/');
            });
        } else {
            console.log($scope.createFolder);
            FoldersFactory.newFolder($scope.createFolder).then( (response)=>{
                $location.path('#!/home');
            });
        }

    };

});

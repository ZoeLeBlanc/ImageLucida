"use strict";
myApp.controller("ViewProjectCtrl", function($scope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory, FoldersFactory){
    // PROJECT SECTION
    $scope.project_id = $routeParams.id;
    $scope.project = {};
    let project = {};
    let folders = [];
    let tags = [];


    ProjectsFactory.getSingleProject($scope.project_id).then( (response)=>{
        project = JSON.parse(response.project);
        console.log(project);
        folders = response.folders;
        tags = response.tags;
        console.log("folders", folders);
        $scope.project = project[0].fields;
        $scope.project.id = project[0].pk;
        $scope.folders = JSON.parse(response.folders);
        angular.forEach($scope.folders, (obj, index)=>{
            obj.fields.id = obj.pk;
        });
        $scope.tags = JSON.parse(response.tags);
        angular.forEach($scope.tags, (obj, index)=>{
            obj.fields.id = obj.pk;
        });
        console.log($scope.tags);
    });
    $scope.duplicateFolder = (folderId) =>{
        FoldersFactory.duplicateFolder(folderId).then( (response)=>{
            $window.location.reload();
        });
    };
    $scope.deleteFolder = (folderId)=>{
        FoldersFactory.deleteFolder(folderId).then( (response)=>{
            console.log(response);
            // $window.location.reload();
        });
        // console.log(folderId);
    };
});

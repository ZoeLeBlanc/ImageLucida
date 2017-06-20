"use strict";
myApp.controller("UnassignCtrl", function($scope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory, FoldersFactory){
    // FOLDer SECTION
    let active_id= $routeParams.active_id;
    console.log(active_id);

    $scope.unassignImage = ()=>{
        TransformFileFactory.unassignTransformFile(active_id).then( (response)=>{
            console.log(response);
        });
    };
    $scope.go_back = function() { 
        $window.history.back();
    };
    
});
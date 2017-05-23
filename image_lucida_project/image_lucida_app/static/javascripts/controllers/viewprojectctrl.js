"use strict";
myApp.controller("ViewProjectCtrl", function($scope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory){
    // PROJECT SECTION
    let project_id = $routeParams.id;
    $scope.project = {};
    // $scope.transforming = false;
    // $scope.untransformed_files = {};
    // $scope.transformed_files = {};
    let project = {};
    let folders = [];
    // let transformed_list = [];
    // let four_points = {};
    ProjectsFactory.getSingleProject(project_id).then( (response)=>{
        project = JSON.parse(response.project);
        folders = response.folders;
        $scope.project = project[0].fields;
        $scope.project.id = project[0].pk;
        $scope.folders = JSON.parse(response.folders);
        angular.forEach($scope.folders, (obj, index)=>{
            obj.fields.id = obj.pk;
        });
    });
   
});
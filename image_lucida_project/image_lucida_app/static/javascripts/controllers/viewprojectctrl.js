"use strict";
myApp.controller("ViewProjectCtrl", function($scope, $location, $routeParams, UserFactory, ProjectsFactory){
    let project_id = $routeParams.id;
    $scope.project = {};
    ProjectsFactory.getSingleProject(project_id).then( (response)=>{
        console.log(response[0]);
        project_id = "";
        $scope.project = response[0].fields;
        console.log($scope.project);
        $scope.project.id = response[0].pk;
        
    });
});
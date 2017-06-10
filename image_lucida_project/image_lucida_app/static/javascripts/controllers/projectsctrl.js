"use strict";
myApp.controller("ProjectsCtrl", function($scope, $location, $window, UserFactory, ProjectsFactory, StatusFactory){
    $scope.projects = [];
    ProjectsFactory.getProjects().then( (response)=>{
        console.log(response);
        angular.forEach(response, (project, index)=>{
            project.fields.id = project.pk;
            console.log(project);
            $scope.projects.push(project.fields);
        });
        console.log($scope.projects);
    });
    $scope.duplicateProject = (projectId) =>{
        ProjectsFactory.duplicateProject(projectId).then( (response)=>{
            $window.location.reload();
        });
    };
    $scope.deleteProject = (projectId)=>{
        ProjectsFactory.deleteProject(projectId).then( (response)=>{
            $window.location.reload();
        });
    };
});
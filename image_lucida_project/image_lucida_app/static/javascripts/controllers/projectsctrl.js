"use strict";
myApp.controller("ProjectsCtrl", function($scope, $rootScope, $location, $window, UserFactory, ProjectsFactory, StatusFactory){
    // UserFactory.authUser().then( (response)=>{
    //     console.log(response);
    //     $rootScope.user_status = response;
    // });
    $scope.projects = [];
    ProjectsFactory.getProjects().then( (response)=>{
        console.log(response);
        if (response.error === "No projects."){
            $scope.projects = [];
        } else {
            angular.forEach(response, (project, index)=>{
                project.fields.id = project.pk;
                console.log(project);
                $scope.projects.push(project.fields);
            });
        }
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

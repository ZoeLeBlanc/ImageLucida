"use strict";
myApp.controller("ProjectsCtrl", function($scope, $rootScope, $location, $window, UserFactory, ProjectsFactory){
    $scope.projects = [];
    ProjectsFactory.getProjects().then( (response)=>{
        $scope.projects = [];
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
        $('select').material_select();
    });
    if ($rootScope.project_id !== undefined){
        $scope.selectedProject = $rootScope.project_id;
    }
    $scope.clickProject = (projectId) => {
        if (projectId.length>0){
            $rootScope.$broadcast('clickProject', `${projectId}`);
        } else {
            $rootScope.project_id = '';
        }
    };

});

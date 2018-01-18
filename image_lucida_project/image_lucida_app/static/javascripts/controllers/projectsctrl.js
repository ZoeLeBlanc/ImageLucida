"use strict";
myApp.controller("ProjectsCtrl", function($scope, $rootScope, $location, $window, UserFactory, ProjectsFactory){
    $scope.projects = [];
    $rootScope.selectedProject='';
    var getProjects = () => {
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
            console.log($rootScope.selectedProject);
            $('select').material_select();
        });
    };
    getProjects();
    if ($rootScope.project_id !== undefined){
        $rootScope.selectedProject = $rootScope.project_id;
        getProjects();
    }
    $scope.clickProject = (projectId) => {
        if (projectId.length>0){
            $rootScope.$broadcast('clickProject', `${projectId}`);
        } else {
            $rootScope.project_id = '';
        }
    };
    $rootScope.$on('selectedProject', (event, data)=>{
        console.log('selectedProject', data);
        $rootScope.selectedProject = '';
        getProjects();
    });
});

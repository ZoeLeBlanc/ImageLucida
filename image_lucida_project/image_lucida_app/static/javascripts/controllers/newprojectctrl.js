"use strict";
myApp.controller("NewProjectCtrl", function($scope, $rootScope, $location, $routeParams, UserFactory, ProjectsFactory){
    let current_location = $location.path();
    $scope.editing = false;
    $scope.createProject ={};
    if (current_location.includes('edit')){
        $scope.editing = true;
        let project_id = $routeParams.id;
        ProjectsFactory.getSingleProject(project_id).then( (response)=>{
            let project = JSON.parse(response.project);
            console.log(JSON.parse(response.project));
            $scope.createProject = project[0].fields;
            $scope.createProject.id = project[0].pk;
        });
    }
    $scope.createNewProject = ()=>{
        ProjectsFactory.cuProject($scope.createProject).then( (response)=>{
            Materialize.toast('Project Created', 300);
            $rootScope.$broadcast('newProject', '');
            $location.url('/home');
        });
    };
    $scope.deleteProject = ()=>{
        ProjectsFactory.deleteProject($routeParams.id).then( (response)=>{
            Materialize.toast('Project Deleted', 300);
            $location.url('/home');
        });
    };


});

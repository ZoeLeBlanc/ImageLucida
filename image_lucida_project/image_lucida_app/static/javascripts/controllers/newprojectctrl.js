"use strict";
myApp.controller("NewProjectCtrl", function($scope, $location, UserFactory, ProjectsFactory){
    $scope.switchValue = true;
    $scope.tagsExist = false;
    $scope.createProject ={};
    $scope.statuses = ['future', 'current', 'completed'];
    $('.chips').material_chip();
    $scope.createNewProject = ()=>{
        $scope.createProject.private = $scope.switchValue;
        $scope.createProject.status = $scope.selectedStatus;
        $scope.tags = [];
        var data = $('.chips').material_chip('data');
        angular.forEach(data, (value, index)=>{
            console.log("data", data[index].tag);
            $scope.tags.push({
                'tag':data[index].tag,
            });
        }); 
        $scope.createProject.tags = $scope.tags;
        console.log($scope.createProject);
        ProjectsFactory.newProject($scope.createProject).then( (response)=>{
            console.log(response);
        });
    };

});
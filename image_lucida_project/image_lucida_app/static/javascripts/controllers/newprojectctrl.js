"use strict";
myApp.controller("NewProjectCtrl", function($scope, $location, $routeParams, UserFactory, ProjectsFactory){
    let current_location = $location.path();
    
    $scope.editing = false;
    $scope.switchValue = true;
    $scope.tagsExist = false;
    $scope.createProject ={};
    $scope.statuses = [{'1': 'future'}, {'2':'current'},{'3':'completed'}];
    if (current_location.includes('edit')){
        $scope.editing = true;
        let project_id = $routeParams.id;
        ProjectsFactory.getSingleProject(project_id).then( (response)=>{
            let project = JSON.parse(response.project);
            let tags = JSON.parse(response.tags);
            console.log(JSON.parse(response.project));
            $scope.createProject = project[0].fields;
            $scope.createProject.id = project[0].pk;
            let data = [];
            angular.forEach(tags, (item, index)=>{
                console.log(item);
                data.push({tag:item.fields.tag_name});
            });
            console.log(data);
            $('.chips-initial').material_chip({data});
            angular.forEach($scope.statuses, (status, index)=>{
                console.log(status);
                angular.forEach(status, (value, key)=>{
                    if ($scope.createProject.status == key){
                        $scope.selectedStatus = value;
                        console.log(value);
                    }
                });
            });
            $scope.switchValue = $scope.createProject.private;
        });
    }
    

    
    // $('.chips').material_chip();
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
        if ($scope.editing){
            ProjectsFactory.updateProject($scope.createProject).then( (response)=>{
            $location.path('#!/projects/');
        });
        } else {
          ProjectsFactory.newProject($scope.createProject).then( (response)=>{
            $location.path('#!/projects/');
        });  
        }
        
    };

});
"use strict";
myApp.controller("UploadFileCtrl", function($scope, $location, $routeParams, UserFactory, ProjectsFactory, UploadFileFactory){
    let project_id = $routeParams.id;
    $scope.project = {};
    $scope.project.files = [];
    ProjectsFactory.getSingleProject(project_id).then( (response)=>{
        let returned_values = JSON.parse(response.project);
        $scope.project = returned_values[0].fields;
        $scope.project.id = returned_values[0].pk;
        console.log($scope.project);
    });
    document.getElementById("file-upload").onchange = function (event) {
        console.log(event);
        
        angular.forEach(this.files, (file, index)=>{
            var reader = new FileReader();
            reader.onload = function (e) {
            // get loaded data and render thumbnail.
                let img = document.createElement("img");
                img.src = e.target.result;
                file.height = img.naturalHeight;
                file.width = img.naturalWidth;
                img.classList.add("responsive-img");
                document.getElementById("file-preview").appendChild(img);
            };
            reader.readAsDataURL(file);
        });
            
        
    };
    $scope.uploadFiles = ()=>{
        console.log($scope.project.id);
        angular.forEach($scope.project.files, (file, index)=>{
            console.log(file);
            UploadFileFactory.uploadFile(file.file, $scope.project.id).then( (response)=>{
                console.log(response);
                if (response.form != 'not saved'){

                    $location.path('#!/projects/view/{$scope.project.id}/');
                } else {
                    $scope.error_message = "File did not upload.";
                }
            });
        });
        
    };
});
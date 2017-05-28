"use strict";
myApp.controller("UploadFileCtrl", function($scope, $location, $routeParams, UserFactory, ProjectsFactory, UploadFileFactory){
    $scope.files = [];
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
        angular.forEach($scope.files, (file, index)=>{
            console.log(file);
            UploadFileFactory.uploadFile(file.file).then( (response)=>{
                console.log(response);
                if (response.form != 'not saved'){
                    Materialize.toast('Images Uploaded', 1000);
                    $location.path('#!/projects/');
                } else {
                    $scope.error_message = "File did not upload.";
                }
            });
        });
        
    };
});
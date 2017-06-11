"use strict";
myApp.controller("UploadFileCtrl", function($scope, $location, $routeParams, $compile, UserFactory, ProjectsFactory, UploadFileFactory){
    $scope.files = [];
    document.getElementById("file-upload").onchange = function (event) {
        angular.forEach(this.files, (file, index)=>{
            console.log(index);
            var reader = new FileReader();
            reader.onload = function (e) {
            // get loaded data and render thumbnail.
                let img = document.createElement("img");
                img.src = e.target.result;
                file.height = img.naturalHeight;
                file.width = img.naturalWidth;
                img.classList.add("responsive-img");
                img.id = index;
                let html = `
                <div class="row">
                    <div class="col s10" id="imagePreview">
                    </div>
                    <div class="col s2">
                        <button class="btn btn-large waves-effect waves-light indigo lighten-1" ng-click="deleteFile(${index})"> Delete </button>
                    </div>
                </div>
                `;
                var temp = $compile(html)($scope); 
                $("#file-preview").append(temp);
                $("#imagePreview").append(img);
            };
            reader.readAsDataURL(file);
        });
            
        
    };
    $scope.uploadFiles = ()=>{
        console.log($scope.files);
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
    $scope.deleteFile = (img_id)=>{
        console.log(img_id);
    };
});
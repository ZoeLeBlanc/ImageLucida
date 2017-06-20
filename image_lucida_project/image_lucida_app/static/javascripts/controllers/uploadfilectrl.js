"use strict";
myApp.controller("UploadFileCtrl", function($scope, $rootScope, $location, $routeParams, $compile, UserFactory, ProjectsFactory, UploadFileFactory){
    UserFactory.authUser().then((response)=>{
        $scope.username = response;
    });
    $scope.files = [];
    document.getElementById("file-upload").onchange = function (event) {
        angular.forEach(this.files, (file, index)=>{
            console.log(file);
            var reader = new FileReader();
            reader.onload = function (e) {
            // get loaded data and render thumbnail.
                let img = document.createElement("img");
                img.src = e.target.result;
                file.height = img.naturalHeight;
                file.width = img.naturalWidth;
                img.classList.add("responsive-img");
                img.id = file.name;
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
    console.log($rootScope.username);
    $scope.uploadFiles = ()=>{
        console.log($scope.files);
        angular.forEach($scope.files, (file, index)=>{
            console.log(file);
            let active_img = $('#'+file.name);
            let file_height = active_img.context.images[0].height;
            let file_width = active_img.context.images[0].width;
            let date = Date.now();
            let name = $scope.username +'/'+ date.toString() +'_' + file.name;
            console.log(name);
            Object.defineProperty(file.file, 'name', {
              writable: true,
              value: name
            });
            UploadFileFactory.uploadFile(file.file, file_width, file_height).then( (response)=>{
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
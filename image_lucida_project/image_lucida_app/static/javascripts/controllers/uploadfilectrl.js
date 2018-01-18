"use strict";
myApp.controller("UploadFileCtrl", function($scope, $rootScope, $location, $routeParams, $compile, UserFactory, ProjectsFactory, UploadFileFactory){
    $scope.files = [];
    document.getElementById("file-upload").onchange = function (event) {
        angular.forEach(this.files, (file, index)=>{
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
                        <div class="card col s12 m5 offset-m1 l2 offset-l1">
                            <div class="card-image" id="${index}">
                            </div>
                            <div class="card-action">
                            <a href="" ng-click="deleteFile(${index})"> Delete (not yet built) </a>
                            </div>
                        </div>
                `;
                var temp = $compile(html)($scope);
                $("#file-preview").append(temp);
                $(`#${index}`).append(img);
            };
            reader.readAsDataURL(file);
        });


    };
    $scope.uploadFiles = ()=>{
        angular.forEach($scope.files, (file, index)=>{
            let active_img =$(`#file-preview`).find(`img`);
            let final_img = active_img.filter(img => active_img[img].id === file.name);
            let file_height = final_img[0].naturalHeight;
            let file_width = final_img[0].naturalWidth;
            let date = Date.now();
            let name = 'uploads/'+ date.toString() +'_' + file.name;
            Object.defineProperty(file.file, 'name', {
              writable: true,
              value: name
            });
            UploadFileFactory.uploadFile(file.file, file_width, file_height).then( (response)=>{
                if (response.form != 'not saved'){
                    Materialize.toast('Images Uploaded', 1000);
                    $location.path('#!/home/');
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

"use strict";
myApp.controller("UploadFileCtrl", function($scope, $rootScope, $location, $routeParams, $compile, UserFactory, ProjectsFactory, UploadFileFactory){
    $('.preloader-wrapper').toggleClass('active');
    $('#preloader').toggleClass('preloader-background');
    $scope.files = [];
    $scope.images = [];
    $scope.process = $rootScope.source_id !== undefined ? true : false;
    console.log($scope.images);
    console.log($scope.process, $rootScope.source_id);
    document.getElementById("file-upload").onchange = function (event) {
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
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
                        <div class="card col s12 m5 offset-m1 l2 offset-l1" id="card_${index}">
                            <div class="card-image" id="${index}">
                            </div>
                            <div class="card-action">
                            <a href="" ng-click="deleteFile(${index})"> delete </a>
                            <a href="" ng-click="containsImage(${index})"> contains image </a>
                            <a href="" ng-click="ocrText(${index})"> ocr text </a>
                            <a href="" ng-click="translateText(${index})"> ocr and translate text </a>
                            </div>
                        </div>
                `;
                var temp = $compile(html)($scope);
                $("#file-preview").append(temp);
                $(`#${index}`).append(img);
                $scope.images[index]= {'index': index, 'contains_image': false, 'translate_text': false, 'ocr_text': false};
            };
            reader.readAsDataURL(file);
            console.log($scope.images);
        });
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');

    };
    $scope.uploadFiles = ()=>{
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
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
                if (response.form !== 'not saved'){
                    Materialize.toast('Images Uploaded', 1000);
                    $('.preloader-wrapper').toggleClass('active');
                    $('#preloader').toggleClass('preloader-background');
                    $location.url('/home');
                } else {
                    $scope.error_message = "File did not upload.";
                }
            });
        });

    };
    $scope.uploadProcessFiles = () => {
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
        let project_id = $rootScope.project_id;
        let folder_id = $rootScope.folder_id;
        let bucket_id = $rootScope.bucket_id;
        let source_id = $rootScope.source_id;
        angular.forEach($scope.files, (file, index) => {
            let active_img = $(`#file-preview`).find(`img`);
            let final_img = active_img.filter(img => active_img[img].id === file.name);
            let file_height = final_img[0].naturalHeight;
            let file_width = final_img[0].naturalWidth;
            let parent = final_img.parent();
            parent = parent[0].id;
            let obj = $scope.images.filter( id => id.index == parent);
            obj = obj[0];
            let date = Date.now();
            let name = 'uploads/' + date.toString() + '_' + file.name;
            Object.defineProperty(file.file, 'name', {
                writable: true,
                value: name
            });
            console.log(file.file, file_width, file_height, project_id, folder_id, bucket_id, source_id, obj);
            UploadFileFactory.uploadProcessFile(file.file, file_width, file_height, project_id, folder_id, bucket_id, source_id, obj.contains_image, obj.translate_text, obj.ocr_text).then((response) => {
                if (response.form !== 'not saved') {
                    Materialize.toast('Images Uploaded', 1000);
                    $('.preloader-wrapper').toggleClass('active');
                    $('#preloader').toggleClass('preloader-background');
                    $location.url('/home');
                } else {
                    $scope.error_message = "File did not upload.";
                }
            });
        });

    };
    $scope.containsImage = (img_id) => {
        $scope.images.map( id => {
            if (id.index == img_id){
                id.contains_image = true;
            }
        });
    };
    $scope.ocrText = (img_id) => {
        $scope.images.map(id => {
            if (id.index == img_id) {
                id.ocr_text = true;
            }
        });
    };
    $scope.translateText = (img_id) => {
        $scope.images.map(id => {
            if (id.index == img_id) {
                id.translate_text = true;
                id.ocr_text = true;
            }
        });
    };
    $scope.deleteFile = (img_id)=>{
        // remove element from dom
        $(`#card_${img_id}`).remove();
        $scope.images = $scope.images.filter( id => id.index != img_id);
        console.log(img_id, $scope.images);
    };
});

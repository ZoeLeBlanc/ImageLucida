"use strict";
myApp.controller("SingleFileCtrl", function($scope, $rootScope, $location, $routeParams, $window, FileFactory, SourceFactory, GroupFactory, TextFileFactory, FoldersFactory){

    $scope.transforming = false;
    $scope.transformed_files = {};
    $scope.tags = {};
    $scope.clickedImage = false;
    $scope.files = [];
    let files_list = [];
    var getFile = (file_id)=>{
        FileFactory.getSingleFile($rootScope.file_id).then( (response)=>{
            console.log(response);
            let file = JSON.parse(response.file);
            let texts = response.texts_serialize;
            let images = response.images_serialize;
            let images_data = response.images_data;
            let tags = response.tags_serialize;
            $scope.selectedImage = '';
            $scope.clickedImage = true;
            let date_created = Date.parse(file[0].date_created);
            let date_updated = Date.parse(file[0].date_updated);
            $("#imageArea").html('');
            $("#imageInfo").html('');
            $("#imageArea").append(`<img class="materialboxed responsive-img" src="${response.file_url}"/>`);
            $("#imageInfo").append(`
                <div class="card col s12">
                <div class="card-content">
                    <span class="card-title">
                        File Properties
                    </span>
                    <ul>
                    <li>Date Created: ${Date(date_created)}</li>
                    <li>Date Updated: ${Date(date_updated)}</li>
                    <li>Date Published: ${file[0].date_published}</li>
                    <li>Page Number: ${file[0].page_number}</li>
                    <li>Google Vision Processed: ${file[0].google_vision_processed}</li>
                    <li>Tesseract Processed: ${file[0].tesseract_processed}</li>
                    <li>Auto Image Processed: ${file[0].auto_image_processed}</li>
                    <li>Manual Image Processed: ${file[0].manual_image_processed}</li>
                    </ul>
                    <div class="input-field col s10 offset-s1">
                        <div class="chips chips-initial">
                            <input ng-model="tags">
                        </div>
                    </div>
                    <div class="card-action">
                        <a href="#!/projects/process-text/${$rootScope.file_id}">OCR Text</a>
                        <a href="#!/projects/process-image/${$rootScope.file_id}">Process Image </a>
                        <a href="#!/projects/view-annotations/${$rootScope.file_id}")">View Annotations</a>
                        <a href="#!/projects/meta-data/${$rootScope.file_id}">Edit File Properties</a>
                        <a href="#!/projects/unassign-image/${$rootScope.file_id}">Unassign Image</a>
                    </div>
            </div>`);
            $('.materialboxed').materialbox();
            let data = [];
            if (file[0].tags !== undefined){
                angular.forEach(file[0].tags, (item, index)=>{
                    console.log(item);
                    data.push({tag:item.fields.tag_name});
                });
                console.log(data);
                $('.chips-initial').material_chip({data});
            }
        });
    };
    $scope.$on('clickFile', (event,data)=>{
        if (data.length >0) {
            $rootScope.file_id = data;
            getFile(data);
        }        
    });

    $scope.showImage = (file_id) =>{
        let file = $scope.files.filter( (file) => {
            return file.id === file_id;});

    };
    $scope.unassignImage = (image_id)=>{
        console.log(image_id);
    };
    if ($rootScope.file_id !== undefined){
        getFile($rootScope.file_id);
    }
});

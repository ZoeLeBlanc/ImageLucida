"use strict";
myApp.controller("FilesCtrl", function($scope, $rootScope, $location, $routeParams, $window, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory, FoldersFactory){

    $scope.transforming = false;
    $scope.transformed_files = {};
    $scope.tags = {};
    $scope.clickedImage = false;
    $scope.files = [];
    let transformed_list = [];
    $scope.$on('clickFolder', (event,data)=>{
        console.log("data", data);
        $rootScope.folder_id = data;
        TransformFileFactory.getFiles($rootScope.folder_id).then( (response)=>{
            if (response.error === "No files."){
                $scope.files = [];
            } else {
                let transformed_list = response.transformed_list;
                angular.forEach(response, (file, index)=>{
                    file.fields.id = file.pk;
                    angular.forEach(transformed_list, (item, index)=>{
                        if(file.fields.transform_file_name === item.file_name){
                            console.log(item);
                            file.fields.url = item.file_url;
                            file.fields.tags = item.file_tags;
                            $scope.files.push(file.fields);
                        }
                    });
                });
            }
            console.log($scope.files);
        });
    });

    $scope.showImage = (file_id) =>{
        angular.forEach($scope.transformed_files, (file, index)=>{

            console.log("file_id", file_id);
            if (file.pk === file_id){
                $scope.selectedImage = '';
                $scope.clickedImage = true;
                let active_id = file.pk;
                console.log("file", file.fields.tags);
                let date_created = Date.parse(file.fields.date_created);
                let date_updated = Date.parse(file.fields.date_updated);
                $("#imageArea").html('');
                $("#imageInfo").html('');
                $("#imageArea").append(`<img class="materialboxed responsive-img" src="${file.fields.url}"/>`);
                $("#imageInfo").append(`
                    <div class="card col s12">
                    <div class="card-content">
                        <span class="card-title">
                            File Properties
                        </span>
                        <ul>
                        <li>Date Created: ${Date(date_created)}</li>
                        <li>Date Updated: ${Date(date_updated)}</li>
                        <li>Archival Source: ${file.fields.archival_source}</li>
                        <li>Issue: ${file.fields.issue}</li>
                        <li>Cover: ${file.fields.cover}</li>
                        <li>Page Number: ${file.fields.page_number}</li>
                        <li>Google Vision Processed: ${file.fields.google_vision_processed}</li>
                        <li>Tesseract Processed: ${file.fields.tesseract_processed}</li>
                        <li>Auto Image Processed: ${file.fields.auto_image_processed}</li>
                        <li>Manual Image Processed: ${file.fields.manual_image_processed}</li>
                        </ul>
                        <div class="input-field col s10 offset-s1">
                            <div class="chips chips-initial">
                                <input ng-model="tags">
                            </div>
                        </div>
                    <div class="card-action">
                        <a href="#!/projects/process-text/${active_id}">OCR Text</a>
                        <a href="#!/projects/process-image/${active_id}">Process Image </a>
                        <a href="#!/projects/view-annotations/${active_id}")">View Annotations</a>
                        <a href="#!/projects/meta-data/${active_id}">Edit File Properties</a>
                        <a href="#!/projects/unassign-image/${active_id}">Unassign Image</a>
                    </div>
                </div>`);
                $('.materialboxed').materialbox();
                let data = [];
                if (file.fields.tags.length > 0){
                    angular.forEach(file.fields.tags, (item, index)=>{
                        console.log(item);
                        data.push({tag:item.fields.tag_name});
                    });
                    console.log(data);
                    $('.chips-initial').material_chip({data});
                }
            }
        });

    };
    $scope.unassignImage = (image_id)=>{
        console.log(image_id);
    };

});

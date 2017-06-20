"use strict";
myApp.controller("ViewFolderCtrl", function($scope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory, FoldersFactory){
    // FOLDer SECTION
    let folder_id = $routeParams.folder_id;
    $scope.folder = {};
    $scope.transforming = false;
    $scope.transformed_files = {};
    $scope.tags = {};
    $scope.clickedImage = false;
    // $scope.selectedImage = "";
    let folder = {};
    let untransformed_list = [];
    let transformed_list = [];
    FoldersFactory.getSingleFolder(folder_id).then( (response)=>{
        console.log(response);
        folder = JSON.parse(response.folder);
        $scope.folder = folder[0].fields;
        $scope.folder.id = folder[0].pk;
        $scope.transformed_files = JSON.parse(response.transformed_files);
        let transformed_list = response.transformed_list;
        $scope.tags = JSON.parse(response.tags);
        angular.forEach($scope.transformed_files, (obj, index)=>{
            obj.fields.id = obj.pk;
            angular.forEach(transformed_list, (item, index)=>{
                if(obj.fields.transform_file_name === item.file_name){
                    console.log(item);
                    obj.fields.url = item.file_url;
                    obj.fields.tags = item.file_tags;
                    if (obj.fields.tags.length > 0){
                        obj.fields.tags = JSON.parse(obj.fields.tags);
                    }
                }
            });
            console.log(obj);
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
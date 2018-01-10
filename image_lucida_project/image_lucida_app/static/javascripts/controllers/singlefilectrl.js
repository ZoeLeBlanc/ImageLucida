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
            console.log(JSON.parse(response.file));
            let file = JSON.parse(response.file);
            file = file[0].fields;
            console.log(file.tesseract_processed);
            let texts = response.texts_serialize;
            let images = response.images_serialize;
            let images_data = response.images_data;
            let tags = response.tags_serialize;
            console.log(tags);
            $scope.selectedImage = '';
            $scope.clickedImage = true;
            let date_created = Date.parse(file.date_created);
            let date_updated = Date.parse(file.date_updated);
            $("#imageArea").html('');
            $("#imageInfo").html('');
            $("#imageArea").append(`<img class="materialboxed responsive-img" src="${response.file_url}"/>`);
            $("#imageInfo").append(`
            <div class="card col s12">
                <div class="card-content">
                    <div class="row">
                        <span class="card-title">${file.file_name}</span>
                    </div>
                    <div class="divider"></div>
                    <ul class="collapsible" data-collapsible="accordion">
                        <li>
                            <div class="collapsible-header">
                                File Properties
                            </div>
                            <div class="collapsible-body">
                                <ul>
                                <li>Date Created: ${Date(date_created)}</li>
                                <li>Date Updated: ${Date(date_updated)}</li>
                                <li>Date Published: ${file.date_published}</li>
                                <li>Page Number: ${file.page_number}</li>
                                <li>Google Vision Processed: ${file.google_vision_processed}</li>
                                <li>Tesseract Processed: ${file.tesseract_processed}</li>
                                <li>Auto Image Processed: ${file.auto_image_processed}</li>
                                <li>Manual Image Processed: ${file.manual_image_processed}</li>
                                </ul>
                                Tags:
                                <div id="tags">
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="collapsible-header">
                                File Actions
                            </div>
                            <div class="collapsible-body">
                                <div class="card-action">
                                <a href="#!/projects/process-text/">OCR Text</a>
                                <a href="#!/projects/auto-segment/">Auto Segment Image</a>
                                <a href="#!/projects/manual-segment/")">Manually Segment Image</a>
                                </div>
                            </div>
                        </li>
                    </ul>
            </div>
        </div>`);

            if (tags.length > 0){
                angular.forEach(JSON.parse(tags), (item, index)=>{
                    var chip = `<div class="chip">${item.fields.tag_name}</div>`;
                    $('#tags').append(chip);
                });
            }
            $('.materialboxed').materialbox();
            $('.collapsible').collapsible();
        });
    };
    $scope.$on('clickFile', (event,data)=>{
        if (data.length >0) {
            $rootScope.file_id = data;
            getFile(data);
        }
    });
    if ($rootScope.file_id !== undefined){
        getFile($rootScope.file_id);
    }
});

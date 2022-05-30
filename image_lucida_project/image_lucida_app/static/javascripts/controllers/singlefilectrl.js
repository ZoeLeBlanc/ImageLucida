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
            let file = JSON.parse(response.file);
            let base_file = JSON.parse(response.base_file);
            file = file[0].fields;
            base_file = base_file[0].fields;
            file.tesseract_processed = base_file.tesseract_processed;
            file.google_vision_processed = base_file.google_vision_processed;
            file.auto_image_processed = base_file.auto_image_processed;
            file.manual_image_processed = base_file.manual_image_processed;
            let tags = response.tags_serialize;
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
                        <span class="card-title" style="word-wrap:break-word;">${file.file_name}</span>
                    </div>
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
                                <a href="#!/projects/view-texts/">View Text</a>
                                <a href="#!/projects/view-images/">View Images</a>
                                </div>
                            </div>
                        </li>
                    </ul>
            </div>
        </div>`);

            if (tags.length > 0){
                var arr1 = Object.values(tags);
                arr1.map( (item)=>{
                    var chip = `<div class="chip">${item.fields.tag_name}</div>`;
                    $('#tags').append(chip);
                });
            }
            $('.materialboxed').materialbox();
            $('.collapsible').collapsible();
        });
        var $window = $(window),
            $imageInfo = $('#imageInfo'),
            elTop = $imageInfo.offset().top;

         $window.scroll(function() {
              $imageInfo.toggleClass('sticky', $window.scrollTop() > elTop);
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

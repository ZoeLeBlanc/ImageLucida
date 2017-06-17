"use strict";
myApp.controller("ViewAnnotationsCtrl", function($scope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory, FoldersFactory, ImageAnnotationFactory){
    // FOLDer SECTION
    let transform_file_id = $routeParams.active_id;
    $scope.transformed_file = {};
    $scope.text_annotation = {};
    $scope.image_annotations = {};
    $scope.tags = {};
    $scope.showTabs = false;
    $scope.allTabContentLoaded = false;
    let image_annotations_list = [];
    TextAnnotationFactory.getTextAnnotations(transform_file_id).then((response)=>{
        $scope.text_annotation = JSON.parse(response.texts);
        console.log($scope.text_annotation);
    });
    ImageAnnotationFactory.getImageAnnotations(transform_file_id).then( (response)=>{
        console.log(response);
        let images_data = response.images_data;
        $scope.image_annotations = JSON.parse(response.images);
        angular.forEach($scope.image_annotations, (image, index)=>{
            image.fields.id = image.pk;
            angular.forEach(images_data, (item, index)=>{
                console.log(item);
                if(image.fields.image_annotation_file_name === item.image_name){
                    image.fields.url = item.image_url;
                    image.fields.tags = item.image_tags;
                    // if(item.image_tags.length > 0){
                    //     image.fields.tags = JSON.parse(image.fields.tags);
                    // }
                }
            });
        });
        console.log($scope.image_annotations);
        $scope.allTabContentLoaded = true;
        $scope.showTabs = true;
    });
    $scope.go_back = function() { 
        $window.history.back();
    };
});
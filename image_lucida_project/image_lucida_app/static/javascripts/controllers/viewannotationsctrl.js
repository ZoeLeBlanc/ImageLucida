"use strict";
myApp.controller("ViewAnnotationsCtrl", function($scope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory, FoldersFactory, ImageAnnotationFactory){
    // FOLDer SECTION
    let transform_file_id = $routeParams.active_id;
    $scope.transformed_file = {};
    $scope.text_annotations = {};
    $scope.image_annotations = {};
    $scope.tags = {};
    let image_annotations_list = [];
    TextAnnotationFactory.getTextAnnotations(transform_file_id).then((response)=>{
        $scope.text_annotations = JSON.parse(response.texts);
        console.log($scope.text_annotations);
    });
    let images;
    let images_urls;
    ImageAnnotationFactory.getImageAnnotations(transform_file_id).then( (response)=>{
        console.log('response', JSON.parse(response.images));
        images_urls = response.image_urls;
        $scope.image_annotations = JSON.parse(response.images);
        angular.forEach($scope.image_annotations, (image, index)=>{
            image.fields.id = image.pk;
            angular.forEach(images_urls, (url, index)=>{
                if (image.fields.image_annotation_file_name == url[0]){
                    image.fields.url = url[1];
                }
                if (image.fields.image_annotation_file_name == url[1]){
                    image.fields.url = url[0];
                }
            });
        });
    });
});
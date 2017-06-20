"use strict";
myApp.controller("ProcessImageCtrl", function($scope, $rootScope, $location, $routeParams, $window, UserFactory, TextAnnotationFactory, TransformFileFactory, ImageAnnotationFactory){
    let transform_file_id = $routeParams.active_id;
    $scope.active_id = transform_file_id;
    let current_path = $location.path();
    $scope.transform_file = {};
    $scope.auto_image = false;
    TransformFileFactory.getSingleTransformFile(transform_file_id).then( (response)=>{
        console.log(response);
        let transform_file = JSON.parse(response.transform_file);
        console.log(transform_file);
        $scope.transform_file = transform_file[0].fields;
        $scope.transform_file.id = transform_file[0].pk;
        $scope.transform_file.url = response.transform_file_url;
        $scope.auto_image = $scope.transform_file.auto_image_processed;
        
        console.log($scope.transform_file);
    });
    $scope.autoImageSegment = ()=>{
        ImageAnnotationFactory.autoImageSegmentation(transform_file_id).then((response)=>{
            console.log(response);
        });
    };
    $scope.go_back = function() { 
        $window.history.back();
    };
});
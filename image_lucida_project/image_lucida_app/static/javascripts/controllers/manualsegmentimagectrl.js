"use strict";
myApp.controller("ManualSegmentImageCtrl", function($scope, $rootScope, $location, $routeParams, $window, UserFactory, TextAnnotationFactory, TransformFileFactory, ImageAnnotationFactory){
    let transform_file_id = $routeParams.active_id;
    $scope.active_id = transform_file_id;
    let transform_file = {};
    $scope.editing = false;
    $scope.annotating= false;
    $scope.loaddata=false;
    $scope.transform_file = {};
    $scope.process_type = {};
    TransformFileFactory.getSingleTransformFile(transform_file_id).then( (response)=>{
        let transform_file = JSON.parse(response.transform_file);
        $scope.transform_file = transform_file[0].fields;
        $scope.transform_file.id = transform_file[0].pk;
        $scope.transform_file.url = response.transform_file_url;
        $scope.imageSrc = response.transform_file_url;
        console.log($scope.transform_file);
        $scope.loaddata=true;
         //IMAGE ANNOTATION TEST
        $scope.points = [[]];
        // $scope.imageSrc = "https://cloud.githubusercontent.com/assets/121322/18649301/a9740512-7e73-11e6-8db1-e266cd1c2a3b.jpg";
        $scope.enabled = true;
        $scope.colorArray = ['#FF0000', '#FFFF00', '#0000FF', '#008000', '#C0C0C0'];
        $scope.activePolygon = 0;
    });
    $scope.undo = function(){
        $scope.points[$scope.activePolygon].splice(-1, 1);
    };

    $scope.clearAll = function(){
        $scope.points[$scope.activePolygon] = [];
    };

    $scope.removePolygon = function (index) {
        $scope.points.splice(index, 1);
        if(index <= $scope.activePolygon) {
            --$scope.activePolygon;
        }
        if($scope.points.length === 0) {
            $scope.enabled = false;
        }
    };
    $scope.add = function (index) {
        $scope.enabled = true;
        $scope.points.push([]);
        $scope.activePolygon = $scope.points.length - 1;
        console.log("$scope.points", $scope.points);
    };
    $scope.savePolygons = function () {
        let width = document.getElementById('canvasImage').width;
        let height = document.getElementById('canvasImage').height;
        let ocr = false;
        let process_type = 'None';
        if ($scope.process_type.googlevision || $scope.process_type.tesseract) {
            ocr = true;
            process_type = Object.keys($scope.process_type)[0];
        }
        console.log(ocr, process_type);
        angular.forEach($scope.points, (array, index)=>{
            if(array.length > 0){
                let outsideArray = [];
                outsideArray.push(array);
                ImageAnnotationFactory.manualSegmentation($scope.active_id, outsideArray, ocr, process_type, height, width).then((response)=>{
                    console.log(response);
                });
            }
        });
    };
    $scope.go_back = function() { 
        $window.history.back();
    };
});
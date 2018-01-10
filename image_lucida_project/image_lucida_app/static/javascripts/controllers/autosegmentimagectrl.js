"use strict";
myApp.controller("AutoSegmentImageCtrl", function($scope, $rootScope, $location, $routeParams, $window, UserFactory, FileFactory, ImageFileFactory){
    let current_path = $location.path();
    $scope.file = {};
    $scope.images = [];
    $scope.auto_image = false;
    var getFile = () => {
        FileFactory.getSingleFile($rootScope.file_id).then( (response)=>{
            $scope.images = [];
            console.log(response);
            let file = JSON.parse(response.file);
            $scope.file = file[0].fields;
            $scope.file.file_url = response.file_url;
            $scope.file.id = file[0].pk;
            let images = response.images_serialize;
            let images_data = response.images_data;
            if (images.length > 0 ){
                angular.forEach(JSON.parse(images), (image, index)=>{
                        angular.forEach(images_data, (data, index)=>{
                            if (image.fields.image_file_name === data.image_name){
                                image.fields.image_file_url = data.image_url;
                                image.fields.tags = data.image_tags;
                                image.fields.id = image.pk;
                                $scope.images.push(image.fields);
                            }
                        });
                });
            }
        });
    };
    ImageFileFactory.autoImageSegmentation($rootScope.file_id).then((response)=>{
        console.log(response);
        $('.preloader-wrapper').removeClass('active');
        getFile();
    });
    $scope.deleteImageFile = function(image_file_id) {
        ImageFileFactory.deleteImageFile(image_file_id).then((response)=>{
            console.log(response);
            getFile();
        });
    };
});

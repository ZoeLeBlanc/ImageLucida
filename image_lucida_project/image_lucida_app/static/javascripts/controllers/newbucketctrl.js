"use strict";
myApp.controller("NewBucketCtrl", function($scope, $rootScope, $location, $routeParams, $window, UserFactory, BucketsFactory){
    let current_location = $location.path();
    $scope.editing = false;
    $scope.createBucket ={};
    if (current_location.includes('edit-bucket')){
        $scope.editing = true;
        let bucket_id = $routeParams.bucket_id;
        BucketsFactory.getSingleBucket(bucket_id).then( (response)=>{
            let bucket = JSON.parse(response.bucket);
            $scope.createBucket = bucket[0].fields;
            $scope.createBucket.id = bucket[0].pk;
        });
    }

    $scope.createNewBucket = ()=>{
        $scope.createBucket.folder_id = $rootScope.folder_id;
        BucketsFactory.cuBucket($scope.createBucket).then( (response)=>{
            $location.path('#!/home/');
        });
    };
    $scope.deleteBucket = ()=>{
        BucketsFactory.deleteBucket($routeParams.bucket_id).then( (response)=>{
            $location.path('#!/home/');
        });
    };
});

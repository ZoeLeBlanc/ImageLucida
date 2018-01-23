"use strict";
myApp.controller("BucketsCtrl", function($scope, $rootScope, $location, $routeParams, $window, BucketsFactory){
    $scope.buckets = [];
    var getBuckets = (folderId) => {
        $scope.buckets = [];
        BucketsFactory.getBuckets(folderId).then( (response)=>{
            console.log(response);
            if (response.error === "No buckets."){
                $scope.buckets = [];
            } else {
                angular.forEach(response, (bucket, index)=>{
                    bucket.fields.id = bucket.pk;
                    $scope.buckets.push(bucket.fields);
                });
            }
            console.log("buckets",$scope.buckets);
        });
    };
    $rootScope.$on('newBucket', (event, data)=>{
        console.log('newBuckets');
        getBuckets($rootScope.folder_id);
    });
    $rootScope.$on('clickFolder', (event, data)=>{
        $rootScope.folder_id = data;
        getBuckets(data);
    });
    if ($rootScope.bucket_id !== undefined){
        getBuckets($rootScope.folder_id);
        $scope.selectedBucket = $rootScope.bucket_id;
    }
    $scope.clickBucket = (bucketId) => {
        if (bucketId.length >0 ){
            $rootScope.$broadcast('clickBucket', `${bucketId}`);
        } else {
            $rootScope.bucket_id='';
        }
    };

});

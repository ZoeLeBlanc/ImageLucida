"use strict";
myApp.controller("SourceCtrl", function($scope, $rootScope, $location, $routeParams, $window, SourceFactory){
    $scope.sources = [];
    var getSources = (bucketId) => {
        $scope.sources = [];
        SourceFactory.getSources(bucketId).then( (response)=>{
            if (response.error === "No sources."){
                $scope.sources = [];
            } else {
                angular.forEach(response, (source, index)=>{
                    source.fields.id = source.pk;
                    $scope.sources.push(source.fields);
                });
            }
            console.log($scope.sources);
        });
    };
    $rootScope.$on('clickBucket', (event, data)=>{
        $rootScope.bucket_id = data;
        getSources(data);
    });
    $scope.clickSource = (sourceId) => {
        if (sourceId.length >0 ){
            $rootScope.$broadcast('clickSource', `${sourceId}`);
        } else {
            $rootScope.source_id='';
        }
    };
    if ($rootScope.source_id !== undefined){
        getSources($rootScope.bucket_id);
        $scope.selectedSource = $rootScope.source_id;
    }
    $rootScope.$on('newSource', (event, data)=>{
        console.log('newSource');
        getSources($rootScope.bucket_id);
    });
});

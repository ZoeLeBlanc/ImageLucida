"use strict";
myApp.controller("NewSourceCtrl", function($scope, $rootScope, $location, $routeParams, $window, UserFactory, SourceFactory){
    let current_location = $location.path();
    $scope.editing = false;
    $scope.createSource ={};
    if (current_location.includes('edit-source')){
        $scope.editing = true;
        let source_id = $routeParams.source_id;
        SourceFactory.getSingleSource(source_id).then( (response)=>{
            let source = JSON.parse(response.source);
            $scope.createSource = source[0].fields;
            $scope.createSource.id = source[0].pk;
        });
    }

    $scope.createNewSource = ()=>{
        $scope.createSource.bucket_id = $rootScope.bucket_id;
        console.log($scope.createSource);
        SourceFactory.cuSource($scope.createSource).then( (response)=>{
            Materialize.toast('Source Created', 300);
            $rootScope.$broadcast('newSource', '');
            $location.url('/home');
        });
    };
    $scope.deleteSource = ()=>{
        SourceFactory.deleteSource($routeParams.source_id).then( (response)=>{
            Materialize.toast('Source Deleted', 300);
            $location.url('/home');
        });
    };
});

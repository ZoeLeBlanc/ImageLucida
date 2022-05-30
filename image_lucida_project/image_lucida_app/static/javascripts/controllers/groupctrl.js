"use strict";
myApp.controller("GroupCtrl", function($scope, $rootScope, $location, $routeParams, $window, GroupFactory){
    $scope.groups = [];
    var getGroups = (sourceId) => {
        $scope.groups = [];
        GroupFactory.getGroups(sourceId).then( (response)=>{
            if (response.error === "No groups."){
                $scope.groups = [];
            } else {
                angular.forEach(response, (group, index)=>{
                    group.fields.id = group.pk;
                    $scope.groups.push(group.fields);
                });
            }
            console.log($scope.groups);
        });
    };
    $rootScope.$on('clickSource', (event, data)=>{
        $rootScope.source_id = data;
        getGroups(data);
    });
    $scope.clickGroup = (groupId) => {
        if (groupId.length>0){
            let group = $scope.groups.filter( (g)=> {
                return g.id===parseInt(groupId);});
            $rootScope.date_published = group[0].date_published;
            $rootScope.group_id=groupId;
            $rootScope.$broadcast('clickGroup', `${groupId}`);
        } else {
            $rootScope.group_id='';
        }

    };
    if ($rootScope.group_id !== undefined){
        getGroups($rootScope.source_id);
        $scope.selectedGroup = $rootScope.group_id;
    }
    $scope.deleteGroup = (groupId)=>{
        GroupFactory.deleteGroup(groupId).then( (response)=>{
            console.log(response);
            $window.location.reload();
        });
    };
});

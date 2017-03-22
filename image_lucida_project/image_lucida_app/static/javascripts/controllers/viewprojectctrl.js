"use strict";
myApp.controller("ViewProjectCtrl", function($scope, $location, $routeParams, UserFactory, ProjectsFactory, FileFactory){
    let project_id = $routeParams.id;
    $scope.project = {};
    $scope.transforming = false;
    $scope.untransformed_files = {};
    $scope.transformed_files = {};
    let project = {};
    let untransformed_list = [];
    ProjectsFactory.getSingleProject(project_id).then( (response)=>{
        project_id = "";
        project = JSON.parse(response.project);
        untransformed_list = response.untransformed_list;
        console.log(untransformed_list);
        $scope.project = project[0].fields;
        $scope.project.id = project[0].pk;
        $scope.untransformed_files = JSON.parse(response.untransformed_files);
        console.log($scope.untransformed_files);
        $scope.transformed_files = JSON.parse(response.transformed_files);
        angular.forEach($scope.untransformed_files, (obj, index)=>{
            angular.forEach(untransformed_list, (item, index)=>{
                console.log(item[0]);
                if(obj.fields.upload_file_name === item[0]){
                    obj.fields.url = item[1];
                }
                if(obj.fields.upload_file_name === item[1]){
                    obj.fields.url = item[0];
                }
            });
        });
        console.log($scope.untransformed_files);
    });
    $scope.markers = {
        'top_left_marker': {
            url: '/static/top_left_marker.jpg',
        },
        'top_right_marker': {
            url: '/static/top_right_marker.jpg',
        },
        'bottom_left_marker': {
            url: '/static/bottom_left_marker.jpg',
        },
        'bottom_right_marker': {
            url: '/static/bottom_right_marker.jpg',
        }
    };
    console.log($scope.markers);
    $scope.startTransformation = ()=>{
        $('#marker').draggable();
        let active_img_id = $('#untransformed_list').find('.active')[0].text;
        $scope.transforming = true;
        let active_img = $('#'+active_img_id+'').find('img');
        // active_img.attr('jqyoui-droppable', '');
        // active_img.attr('data-drop', 'true');
        console.log("active", active_img);
        // active_img.droppable();

        let click_counter = 0;
        active_img.on("click", function (evt) {
            // click_counter++;
            // if (4) {
            //     I have all coords
            // }
            console.log(evt);
        });
    };
    $scope.clearTransformation = ()=>{

    };
    $scope.saveTransformation = ()=>{

    };
    $scope.handleClick = function( event ){
        console.log(event);
        $scope.mouseX = event.pageX;
        $scope.mouseY = event.pageY;
        console.log($scope.mouseX, $scope.mouseY);
    };
});
"use strict";
myApp.controller("ViewProjectCtrl", function($scope, $location, $routeParams, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory){
    let project_id = $routeParams.id;
    $scope.project = {};
    $scope.transforming = false;
    $scope.untransformed_files = {};
    $scope.transformed_files = {};
    let project = {};
    let untransformed_list = [];
    let four_points = {};
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
    });
    let active_img;
    $scope.startTransformation = ()=>{
        $('#marker').draggable();
        let active_img_id = $('#untransformed_list').find('.active')[0].text;
        $scope.transforming = true;
        active_img = $('#'+active_img_id+'').find('img');
        let click_counter = 0;
        active_img.on("click", function (evt) {
            click_counter++;
            let parentOffset = 0;
            let y_point = [];
            let x_point = [];
            parentOffset = $(this).offset(); 
            y_point = evt.pageX - parentOffset.left;
            x_point = evt.pageY - parentOffset.top;
            if (click_counter === 1){
                four_points.top_left = [x_point, y_point];
                $(this).parent().append(`<div class="col s2" id="marker"><img src="/static/top_left_marker.png" class="responsive-img" style="width:1em;height:auto;position:absolute; left:${evt.pageX};top:${evt.pageY}" /></div>`);
            }
            if (click_counter === 2){
                four_points.top_right = [x_point, y_point];
                $(this).parent().append(`<div class="col s2" id="marker"><img src="/static/top_right_marker.png" class="responsive-img" style="width:1em;height:auto;position:absolute; left:${evt.pageX};top:${evt.pageY}" /></div>`);
            }
            if (click_counter === 3){
                four_points.bottom_right = [x_point, y_point];
                $(this).parent().append(`<div class="col s2" id="marker"><img src="/static/bottom_right_marker.png" class="responsive-img" style="width:1em;height:auto;position:absolute; left:${evt.pageX};top:${evt.pageY}" /></div>`);
            }
            if (click_counter === 4){
                four_points.bottom_left = [x_point, y_point];
                $(this).parent().append(`<div class="col s2" id="marker"><img src="/static/bottom_left_marker.png" class="responsive-img" style="width:1em;height:auto;position:absolute; left:${evt.pageX};top:${evt.pageY}" /></div>`);
            }
        });
    };
    $scope.clearTransformation = ()=>{
        four_points = {};
        $scope.transforming = false;
        $("div[id^='marker']").remove();
    };
    $scope.saveTransformation = ()=>{
        let upload_file_name = active_img[0].attributes[0].value;
        let coords = valuesToArray(four_points);
        TransformFileFactory.setTransformation(upload_file_name, coords, project_id).then( (response)=>{
            console.log(response);
        });
    };
    function valuesToArray(obj) {
      return Object.keys(obj).map(key => obj[key])
    }
});
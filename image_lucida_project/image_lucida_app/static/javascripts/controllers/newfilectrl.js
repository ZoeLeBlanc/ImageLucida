"use strict";
myApp.controller("NewFileCtrl", function($scope, $rootScope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, FileFactory, SourceFactory, GroupFactory, TextFileFactory){
    let upload_list = [];
    $scope.transforming = false;
    $scope.points = [[]];
    $scope.upload_files = [];
    $scope.showTabs = false;
    $scope.allTabContentLoaded = false;
    $scope.selection=false;
    $scope.switchGroup = false;
    $scope.loaddata = true;
    $scope.file = {};
    $scope.page_number ='';
    $scope.date_published='';
    UploadFileFactory.getUploadedFiles().then( (response)=>{
        if (response.error === "No uploaded files."){
            $scope.upload_files = [];
            console.log('no files');
        } else {
            let upload_files = JSON.parse(response.upload_files);
            upload_list = response.upload_list;
            angular.forEach(upload_files, (obj, index)=>{
                obj.fields.id = obj.pk;
                angular.forEach(upload_list, (item, index)=>{
                    if(obj.fields.upload_file_name === item[0]){
                        obj.fields.url = item[1];
                    }
                    if(obj.fields.upload_file_name === item[1]){
                        obj.fields.url = item[0];
                    }
                });
                $scope.upload_files.push(obj.fields);
            });
            $scope.allTabContentLoaded = true;
            $scope.showTabs = true;

        }
    });

    $scope.startTransformFile = () => {
        console.log($scope);
        $scope.transforming = true;
        $scope.points = [[]];
        // $scope.imageSrc = "https://cloud.githubusercontent.com/assets/121322/18649301/a9740512-7e73-11e6-8db1-e266cd1c2a3b.jpg";
        $scope.enabled = true;
        $scope.colorArray = ['#FF0000', '#FFFF00', '#0000FF', '#008000', '#C0C0C0'];
        $scope.activePolygon = 0;
        let active_img_id = $('#upload_list').find('.active')[0].text;
        console.log("active", active_img_id);
        $scope.image = $('#upload-image'+active_img_id+'').find('canvas');
        console.log($scope.image);
        $scope.imageSrc = $scope.image.src;
        $scope.file = $scope.upload_files.filter( (file) => {
            return file.id === parseInt($scope.image[0].id);
        });
        console.log($scope.file);


    };
    $rootScope.$on('clickSource', (event, data)=>{
        $rootScope.source_id = data;
        $scope.selection = true;
        $('#tagsDiv').append(`<div class="chips"></div>`);
        // console.log("div",$('#tagsDiv'));
        $('.chips').material_chip();
    });
    $scope.addGroup = (switchGroup) => {
        $scope.switchGroup = !switchGroup;
        $scope.group={};
        console.log($scope.switchGroup);
    };
    $scope.addNewGroup = (newGroup) => {
        newGroup.source_id = $rootScope.source_id;
        console.log(newGroup);
        GroupFactory.createGroup(newGroup).then((response)=>{
            console.log(response);
            $scope.group = response.fields;
            $scope.group.id= response.pk;
            $rootScope.group_id = response.pk;
            $scope.new_group = {};
        });
    };
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
        let project_id = $rootScope.project_id;
        let folder_id = $rootScope.folder_id;
        let bucket_id = $rootScope.bucket_id;
        let source_id = $rootScope.source_id;
        let group_id;
        let date_published;
        let page_number = $scope.file[0].page_number;
        console.log($rootScope);
        if ($rootScope.group_id !== undefined){
            group_id = $rootScope.group_id;
            date_published = $rootScope.date_published;
        } else {
            group_id = '';
            date_published = $scope.file[0].date_published;
        }
        $scope.tags = [];
        var data = $('.chips').material_chip('data');
        angular.forEach(data, (value, index)=>{
            console.log("data", data[index].tag);
            $scope.tags.push({
                'tag':data[index].tag,
            });
        });
        angular.forEach($scope.points, (array, index)=>{
            if(array.length > 0){
                let outsideArray = [];
                outsideArray.push(array);
                console.log(outsideArray);
                console.log($scope.file, $scope.image);
                console.log(project_id, folder_id, bucket_id,source_id, group_id,$scope.file[0].id, $scope.file[0].upload_file_name, outsideArray, $scope.image[0].height, $scope.image[0].width, date_published, page_number);
                console.log(group_id.length);
                FileFactory.createFile(project_id, folder_id, bucket_id,source_id, group_id,$scope.file[0].id, $scope.file[0].upload_file_name, outsideArray, $scope.image[0].height, $scope.image[0].width, date_published, page_number, $scope.tags).then( (response)=>{
                    console.log(response);
                    Materialize.toast('Transformation Saved', 1000);
                    $scope.transforming = false;
                    // $window.location.reload();
                });
            }
        });

    };
    $scope.go_back = function() {
        $window.history.back();
    };

});

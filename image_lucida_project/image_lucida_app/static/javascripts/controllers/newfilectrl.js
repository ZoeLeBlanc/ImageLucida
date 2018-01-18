"use strict";
myApp.controller("NewFileCtrl", function($scope, $rootScope, $location, $routeParams, $window, $q, UserFactory, ProjectsFactory, UploadFileFactory, FileFactory, SourceFactory, GroupFactory, TextFileFactory){
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
    $scope.activePolygon = 0;
    $scope.points = [[]];
    $scope.enabled = true;
    $scope.colorArray = ['#FF0000', '#FFFF00', '#0000FF', '#008000', '#C0C0C0'];
    $scope.imageSrc = '';
    var getUploadedFiles = () => {
        UploadFileFactory.getUploadedFiles().then( (response)=>{
            $scope.upload_files = [];
            if (response.error === "No uploaded files."){
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
    };
    getUploadedFiles();

    $scope.startTransformFile = () => {
        $scope.transforming = true;
        // $scope.imageSrc = "https://cloud.githubusercontent.com/assets/121322/18649301/a9740512-7e73-11e6-8db1-e266cd1c2a3b.jpg";

        let active_img_id = $('#upload_list').find('.active')[0].text;
        console.log("active", active_img_id);
        $scope.image = $('#upload-image'+active_img_id+'').find('canvas');
        console.log($scope.image);
        $scope.imageSrc = $scope.image.src;
        $scope.file = $scope.upload_files.filter( (file) => {
            return file.id === parseInt($scope.image[0].id);
        });
        console.log($scope.activePolygon);
    };
    $rootScope.$on('clickSource', (event, data)=>{
        $rootScope.source_id = data;
        $scope.selection = true;
        $('#tagsDiv').append(`<div class="chips"></div>`);
        $('.chips').material_chip();
    });
    if ($rootScope.source_id !== undefined){
        $scope.selection = true;
        $('#tagsDiv').append(`<div class="chips"></div>`);
        $('.chips').material_chip();
    }
    $scope.addGroup = (switchGroup) => {
        $scope.switchGroup = !switchGroup;
        $scope.group={};
    };
    $scope.addNewGroup = (newGroup) => {
        newGroup.source_id = $rootScope.source_id;
        GroupFactory.createGroup(newGroup).then((response)=>{
            console.log(response);
            $scope.group = response[0].fields;
            $scope.group.id= response[0].pk;
            $rootScope.group_id = response[0].pk;
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
    };
    $scope.savePolygons = function () {
        let project_id = $rootScope.project_id;
        let folder_id = $rootScope.folder_id;
        let bucket_id = $rootScope.bucket_id;
        let source_id = $rootScope.source_id;
        let group_id;
        let date_published;
        let page_number = $scope.file[0].page_number;
        let pages = [];
        if (page_number.contains(',')){
            let all_pages = page_number.split(',');
            pages = all_pages.filter( (page)=> {
                return parseInt(page);
            });
        } else {
            pages.push(page_number);
        }
        console.log(pages);
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
            $scope.tags.push({
                'tag':data[index].tag,
            });
        });
        let points = $scope.points.filter( (array)=>{
            if(array.length>0){
                return array;
            }
        });
        var promises = [];
        angular.forEach(points, (array, index)=>{
            let outsideArray = [];
            outsideArray.push(array);
            var promise = FileFactory.createFile(project_id, folder_id, bucket_id,source_id, group_id,$scope.file[0].id, $scope.file[0].upload_file_name, outsideArray, $scope.image[0].height, $scope.image[0].width, date_published, parseInt(pages[index]), $scope.tags).then( (response)=>{
                    console.log(response);
                    Materialize.toast('Transformation Saved', 1000);
                    $scope.transforming = false;
                    getUploadedFiles();
                    $scope.activePolygon = 0;
                    $scope.points = [[]];
                    $scope.enabled = true;
                    $scope.colorArray = ['#FF0000', '#FFFF00', '#0000FF', '#008000', '#C0C0C0'];
                    $scope.imageSrc = '';
            });
            promises.push(promise);
        });
        $q.all(promises).then( (response)=>{
            console.log(response);
            $location.path('#!/home');
        });
    };
});

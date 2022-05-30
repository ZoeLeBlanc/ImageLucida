"use strict";
myApp.controller("FilesCtrl", function($scope, $rootScope, $location, $routeParams, $window, FileFactory, SourceFactory, GroupFactory, TextFileFactory, FoldersFactory){

    $scope.transforming = false;
    $scope.transformed_files = {};
    $scope.tags = {};
    $scope.clickedImage = false;
    $scope.files = [];
    $scope.filterFiles = [];
    $scope.fileTypes = [
        {type:'google_vision_processed'},
        {type:'tesseract_processed'},
        {type:'auto_image_processed'},
        {type:'manual_image_processed'},
        {type:'clear'},
    ];
    $scope.searchText = '';
    $scope.filter = (type, fileFilter)=> {
        $scope.filterFiles = $scope.files;
        $scope.filterFiles = $scope.filterFiles.filter( (file)=> {
            if(type === 'clear'){
                return file;
            } else if(file[type] === fileFilter){
                return file;
            }
        });
        return $scope.filterFiles;
    };
    let files_list = [];
    var getSourceFiles = (source_id) => {
        FileFactory.getSourceFiles(source_id).then( (response)=>{
            $scope.files = [];
            if (response.error === "No files."){
                $scope.files = [];
            } else {
                let files = JSON.parse(response.files);
                files_list = response.files_list;
                angular.forEach(files, (obj, index)=>{
                    obj.fields.id = obj.pk;
                    if (obj.fields.group_id !== undefined) {
                        $rootScope.group_id = obj.fields.group_id;
                    }
                    angular.forEach(files_list, (item, index)=>{
                        if(obj.fields.file_name === item.file_name){
                            obj.fields.url = item.file_url;
                            obj.fields.google_vision_processed = item.google_vision_processed;
                            obj.fields.tesseract_processed = item.tesseract_processed;
                            obj.fields.auto_image_processed = item.auto_image_processed;
                            obj.fields.manual_image_processed = item.manual_image_processed;
                        }
                    });
                    $scope.files.push(obj.fields);
                });
            }
            $scope.filterFiles = $scope.files;
        });
    };
    $scope.$on('clickSource', (event,data)=>{
        $rootScope.source_id = data;
        getSourceFiles(data);
    });
    var getGroupFiles = (group_id) => {
        FileFactory.getGroupFiles(group_id).then( (response)=>{
            $scope.files = [];
            if (response.error === "No files."){
                $scope.files = [];
            } else {
                let files = JSON.parse(response.files);
                files_list = response.files_list;
                angular.forEach(files, (obj, index)=>{
                    obj.fields.id = obj.pk;
                    angular.forEach(files_list, (item, index)=>{
                        if(obj.fields.file_name === item[0]){
                            obj.fields.url = item[1];
                        }
                        if(obj.fields.file_name === item[1]){
                            obj.fields.url = item[0];
                        }
                    });
                    $scope.files.push(obj.fields);
                });
            }
            $scope.filterFiles = $scope.files;
        });
    };
    $scope.$on('clickGroup', (event,data)=>{
        $rootScope.group_id = data;
        getGroupFiles(data);
    });
    $scope.showImage = (file_id) => {
        $rootScope.file_id = file_id;
        $rootScope.$broadcast('clickFile', `${file_id}`);
    };
    if ($rootScope.group_id !== undefined){
        console.log('group');
        getGroupFiles($rootScope.group_id);
        $scope.selectedGroup = $rootScope.source_id;
    } else if ($rootScope.source_id !== undefined) {
        getSourceFiles($rootScope.source_id);
    }

});

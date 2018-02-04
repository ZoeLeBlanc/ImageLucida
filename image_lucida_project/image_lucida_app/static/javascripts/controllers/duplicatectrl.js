"use strict";
myApp.controller("DuplicateCtrl", function($scope, $rootScope, $location, $window, $q, UserFactory, ProjectsFactory, FileFactory){
    $('.preloader-wrapper').toggleClass('active');
    $('#preloader').toggleClass('preloader-background');
    $scope.fromProject = true;
    $scope.selectedFiles = false;
    $scope.duplicateFiles = [];
    var getSourceFiles = (source_id) => {
        FileFactory.getSourceFiles(source_id).then( (response)=>{
            $scope.files = [];
            if (response.error === "No files."){
                $scope.files = [];
            } else {
                let files = JSON.parse(response.files);
                let files_list = response.files_list;
                angular.forEach(files, (obj, index)=>{
                    obj.fields.id = obj.pk;
                    if (obj.fields.group_id !== undefined) {
                        $rootScope.group_id = obj.fields.group_id;
                    }
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
        });
    };
    $scope.$on('clickSource', (event,data)=>{
        $rootScope.source_id = data;
        getSourceFiles(data);
    });
    $scope.duplicateFile = (file_id)=>{
        $scope.selectedFiles = true;
        let hasClass = $(`#collection_${file_id}`).hasClass('blue lighten-3');
        if (hasClass){
            $scope.duplicateFiles = $scope.duplicateFiles.filter( (file)=> file.id !== file_id);
            $(`#collection_${file_id}`).removeClass('blue lighten-3');
        } else {
            $scope.files.filter( (file)=> {
                $scope.duplicateFiles.push(file);
            });
            $(`#collection_${file_id}`).addClass('blue lighten-3');
        }
    };
    $scope.fromProject = ()=>{
        $rootScope.project_id = '';
        $rootScope.folder_id = '';
        $rootScope.bucket_id = '';
        $rootScope.source_id = '';
        $scope.fromProject = !$scope.fromProject;
    };
    $scope.duplicateFilesToProject=() => {
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
        let project_id = $rootScope.project_id;
        let folder_id = $rootScope.folder_id;
        let bucket_id = $rootScope.bucket_id;
        let source_id = $rootScope.source_id;
        let group_id;
        if ($rootScope.group_id !== undefined){
            group_id = $rootScope.group_id;
        } else {
            group_id = '';
        }
        var promises = [];
        angular.forEach($scope.duplicateFiles, (file, index)=>{
            var promise = FileFactory.duplicateFile(project_id, folder_id, bucket_id, source_id, group_id, file.id, file.date_published, file.page_number).then((response)=>{
                console.log(response);
            });
            promises.push(promise);
        });
        $q.all(promises).then( (response)=>{
            Materialize.toast('Files Duplicated', 1000);
            $('.preloader-wrapper').toggleClass('active');
            $('#preloader').toggleClass('preloader-background');
            $scope.fromProject = true;
            $scope.selectedFiles = false;
            $scope.duplicateFiles = [];
        });
    };
});

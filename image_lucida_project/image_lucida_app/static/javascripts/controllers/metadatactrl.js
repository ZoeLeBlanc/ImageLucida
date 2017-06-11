"use strict";
myApp.controller("MetaDataCtrl", function($scope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory){
    let transform_file_id = $routeParams.active_id;
    // ARCHIVE SECTION
    $scope.selectArchive = true;
    $scope.allArchivalSources = {};
    $scope.fileArchivalSources = {};
    ArchivalSourceFactory.getAllArchivalSources().then((response)=>{
        console.log(response);
        $scope.allArchivalSources = response;
            // angular.forEach(response, (archive, index)=>{
            // archive.fields.id = archive.pk;
            // console.log(archive);
            // $scope.allArchivalSources.push(archive.fields);
            // });   
          
    });
    ArchivalSourceFactory.getFileArchivalSources(transform_file_id).then((response)=>{
        console.log(response);
        $scope.allFileArchivalSources = response;
            // angular.forEach(response, (archive, index)=>{
            // archive.fields.id = archive.pk;
            // console.log(archive);
            // $scope.allArchivalSources.push(archive.fields);
            // });   
           
    });
    $scope.addNewArchive = ()=>{
        $scope.selectArchive = false;
    };
    $scope.saveNewArchive = ()=>{
        ArchivalSourceFactory.newArchivalSource($scope.archival_source).then( (response)=>{
            $scope.archival_source = {};
            $scope.saveArchive(response[0].pk);
        });
    };
    $scope.saveArchive = (select_archive)=>{
        let archive_id = select_archive;
        // let active_file_id = $('#transformed_list').find('.active')[0].text;
        // let active_file = $('#transformed-image'+active_file_id+'').find('img');
        // console.log(active_file);
        // let transform_file_name = active_file[0].attributes[0].value;
        // let transform_file_id = active_file[0].id;
        // console.log(archive_id, transform_file_name);
        TransformFileFactory.addArchivalSource(transform_file_id, archive_id).then( (response)=>{
            console.log(response);
        });
    };
    // ISSUE SECTION
    $scope.selectIssue = true;
    $scope.allIssues = {};
    $scope.fileIssues = {};
    IssueFactory.getAllIssues().then((response)=>{
        console.log(response);
        $scope.allIssues = response;
    });
    IssueFactory.getFileIssues(transform_file_id).then((response)=>{
        console.log(response);
        $scope.fileIssues = response;
    });
    $scope.addNewIssue = ()=>{
        $scope.selectIssue = false;
    };
    $scope.saveNewIssue = ()=>{
        IssueFactory.newIssue($scope.issue).then( (response)=>{
            $scope.issue = {};
            $scope.saveIssue(response[0].pk);
        });
    };
    $scope.saveIssue = (select_issue)=>{
        let issue_id = select_issue;
        TransformFileFactory.addIssue(transform_file_id, issue_id).then( (response)=>{
            console.log(response);
        });
    };
    
});
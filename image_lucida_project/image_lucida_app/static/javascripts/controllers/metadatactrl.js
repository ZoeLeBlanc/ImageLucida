"use strict";
myApp.controller("MetaDataCtrl", function($scope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory){
    let transform_file_id = $routeParams.active_id;
    $scope.selectIssue = true;
    $scope.selectArchive = true;
    $scope.tagsExist = false;
    $('.chips').material_chip();
    // ARCHIVE SECTION
    $scope.selectArchive = true;
    $scope.allArchivalSources = {};
    $scope.fileArchivalSources = [];
    $scope.transform_file = {};
    TransformFileFactory.getSingleTransformFile(transform_file_id).then( (response)=>{
        console.log(response);
        let transform_file = JSON.parse(response.transform_file);
        $scope.current_archival_source = JSON.parse(response.archival_source);
        $scope.current_issue = JSON.parse(response.issue);
        $scope.transform_file = transform_file[0].fields;
        console.log($scope.transform_file);
        let tags = JSON.parse(response.tags_serialize);
        $scope.tags = tags;
        let data = [];
        angular.forEach($scope.tags, (item, index)=>{
            console.log(item);
            data.push({tag:item.fields.tag_name});
        });
        console.log(data);
        $('.chips-initial').material_chip({data});
    });
    ArchivalSourceFactory.getAllArchivalSources().then((response)=>{
        $scope.allArchivalSources = response;
        angular.forEach($scope.allArchivalSources, (source, index)=>{
            source.fields.id = source.pk;
        });
    
        console.log($scope.allArchivalSources);
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
        console.log(archive_id, transform_file_id);
        TransformFileFactory.addArchivalSource(transform_file_id, archive_id).then( (response)=>{
            console.log(response);
        });
    };
    // ISSUE SECTION
    IssueFactory.getAllIssues().then((response)=>{
        console.log(response);
        $scope.allIssues = response;
        angular.forEach($scope.allIssues, (issue, index)=>{
            issue.fields.id = issue.pk;
        });
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
    $scope.go_back = function() { 
        $window.history.back();
    };
    $('.chips-initial').on('chip.delete', (e, chip)=>{
        TransformFileFactory.removeTag(transform_file_id, chip.tag).then((response)=>{
            console.log(response);
        });
    });
    $scope.saveTags = ()=>{
        let all_tags = [];
        console.log($scope.tags);
        var data = $('.chips-initial').material_chip('data');
        console.log(data);
        if (data.length === 0){
            data = $('.chips').material_chip('data');
        }
        console.log(data);
        angular.forEach(data, (value, index)=>{
            console.log("data", data[index].tag);
            all_tags.push({
                'tag':data[index].tag,
            });
        });
        angular.forEach(all_tags, (tag, index)=>{
            TransformFileFactory.tagTransformFile(transform_file_id, tag.tag).then( (response)=>{
                console.log(response);
            });
        });
    };
});
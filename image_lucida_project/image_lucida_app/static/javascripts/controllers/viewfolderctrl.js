"use strict";
myApp.controller("ViewFolderCtrl", function($scope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory, FoldersFactory){
    // FOLDer SECTION
    let folder_id = $routeParams.folder_id;
    $scope.folder = {};
    $scope.transforming = false;
    $scope.transformed_files = {};
    $scope.tags = {};
    $scope.clickedImage = false;
    // $scope.selectedImage = "";
    let folder = {};
    let untransformed_list = [];
    let transformed_list = [];
    FoldersFactory.getSingleFolder(folder_id).then( (response)=>{
        console.log(response);
        folder = JSON.parse(response.folder);
        $scope.folder = folder[0].fields;
        $scope.folder.id = folder[0].pk;
        $scope.transformed_files = JSON.parse(response.transformed_files);
        let transformed_list = response.transformed_list;
        $scope.tags = JSON.parse(response.tags);
        console.log("$scope.transformed_files", $scope.transformed_files);
        angular.forEach($scope.transformed_files, (obj, index)=>{
            obj.fields.id = obj.pk;
            angular.forEach(transformed_list, (item, index)=>{
                console.log(item[0]);
                if(obj.fields.transform_file_name === item[0]){
                    obj.fields.url = item[1];
                }
                if(obj.fields.transform_file_name === item[1]){
                    obj.fields.url = item[0];
                }
            });
            console.log(obj);
        });
    });
    $scope.showImage = (file_id) =>{
        angular.forEach($scope.transformed_files, (file, index)=>{
            console.log("file", file.pk);
            console.log("file_id", file_id);
            if (file.pk === file_id){
                $scope.selectedImage = '';
                $scope.clickedImage = true;
                let active_id = file.pk;
                let date = Date.parse(file.fields.date_created);
                $("#imageArea").html('');
                $("#imageInfo").html('');
                $("#imageArea").append(`<img class="materialboxed responsive-img" src="${file.fields.url}"/>`);
                $("#imageInfo").append(`
                    <div class="card col s12">
                    <div class="card-content">
                        <span class="card-title">
                            File Properties
                        </span>
                        <ul>
                        <li>Date Created: ${Date(date)}</li>
                        <li>Archival Source: ${file.fields.archival_source}</li>
                        <li>Issue: ${file.fields.issue}</li>
                        <li>Page Number: ${file.fields.page_number}</li>
                        <li>Google Vision Processed: ${file.fields.google_vision_processed}</li>
                        <li>Tesseract Processed: ${file.fields.tesseract_processed}</li>
                        <li>Auto Image Processed: ${file.fields.auto_image_processed}</li>
                        <li>Manual Image Processed: ${file.fields.manual_image_processed}</li>
                    </div>
                    <div class="card-action">
                        <a href="#!/projects/process-text/${active_id}">OCR Text</a>
                        <a href="#!/projects/process-image/${active_id}">Process Image </a>
                        <a href="#!/projects/view-annotations/${active_id}")">View Annotations</a>
                    </div>
                </div>`);
                $('.materialboxed').materialbox();
            }
        });
    };
    
    // ARCHIVE SECTION
    $scope.selectArchive = true;
    $scope.archivalSources = [];
    ArchivalSourceFactory.getArchivalSources().then((response)=>{
        console.log(response);
        if (response.error){
            $scope.archivalSources = [];
        } 
        else {
            angular.forEach(response, (archive, index)=>{
            archive.fields.id = archive.pk;
            console.log(archive);
            $scope.archivalSources.push(archive.fields);
            });
        }   
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
        let active_file_id = $('#transformed_list').find('.active')[0].text;
        let active_file = $('#transformed-image'+active_file_id+'').find('img');
        console.log(active_file);
        let transform_file_name = active_file[0].attributes[0].value;
        console.log(archive_id, transform_file_name);
        TransformFileFactory.addArchivalSource(transform_file_name, archive_id).then( (response)=>{
            console.log(response);
        });
    };
    // ISSUE SECTION
    $scope.selectIssue = true;
    $scope.issues = [];
    IssueFactory.getIssues().then((response)=>{
        console.log(response);
        if (response.error){
            $scope.issues = [];
        } 
        else {
            angular.forEach(response, (issue, index)=>{
            issue.fields.id = issue.pk;
            console.log(issue);
            $scope.issues.push(issue.fields);
            });
        }   
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
        let active_file_id = $('#transformed_list').find('.active')[0].text;
        let active_file = $('#transformed-image'+active_file_id+'').find('img');
        console.log(active_file);
        let transform_file_name = active_file[0].attributes[0].value;
        console.log(issue_id, transform_file_name);
        TransformFileFactory.addIssue(transform_file_name, issue_id).then( (response)=>{
            console.log(response);
        });
    };
});
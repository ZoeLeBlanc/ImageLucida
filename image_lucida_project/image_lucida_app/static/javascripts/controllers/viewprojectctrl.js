"use strict";
myApp.controller("ViewProjectCtrl", function($scope, $location, $routeParams, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory){
    // PROJECT SECTION
    let project_id = $routeParams.id;
    $scope.project = {};
    $scope.transforming = false;
    $scope.untransformed_files = {};
    $scope.transformed_files = {};
    let project = {};
    let untransformed_list = [];
    let transformed_list = [];
    let four_points = {};
    ProjectsFactory.getSingleProject(project_id).then( (response)=>{
        project = JSON.parse(response.project);
        untransformed_list = response.untransformed_list;
        transformed_list = response.transformed_list;
        console.log(untransformed_list);
        $scope.project = project[0].fields;
        $scope.project.id = project[0].pk;
        $scope.untransformed_files = JSON.parse(response.untransformed_files);
        $scope.transformed_files = JSON.parse(response.transformed_files);
        console.log($scope.transformed_files);
        angular.forEach($scope.untransformed_files, (obj, index)=>{
            obj.fields.id = obj.pk;
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
    // TRANSFORM SECTION
    let a_b = [];
    let b_c = [];
    let c_d = [];
    let d_a = [];
    $scope.startTransformation = ()=>{
        let active_img_id = $('#untransformed_list').find('.active')[0].text;
        $scope.transforming = true;
        let active_img = $('#untransformed-image'+active_img_id+'').find('img');
        console.log(active_img);
        let n_h = active_img[0].height;
        let n_w = active_img[0].width;
        let o_h = active_img[0].naturalHeight;
        let o_w = active_img[0].naturalWidth;
        let aspect_ratio_w = parseInt(o_w) / parseInt(n_w);
        let aspect_ratio_h = parseInt(o_h) / parseInt(n_h);
        console.log(aspect_ratio_w);
        let click_counter = 0;
        active_img.on("click", function (evt) {
            click_counter++;
            let parentOffset = 0;
            let y_point = [];
            let x_point = [];
            parentOffset = $(this).offset(); 
            console.log(parentOffset);
            y_point = (evt.pageX - parentOffset.left) * aspect_ratio_h;
            console.log(y_point);
            x_point = (evt.pageY - parentOffset.top) * aspect_ratio_w;
            console.log(x_point);
            if (click_counter === 1){
                four_points.top_left = [y_point, x_point];
                a_b.push({'x1':evt.pageX, 'y1': evt.pageY});
                d_a.push({'x1':evt.pageX, 'y1': evt.pageY});
                
            }
            if (click_counter === 2){
                four_points.top_right = [y_point, x_point];
                a_b.push({'x2':evt.pageX, 'y2': evt.pageY});
                b_c.push({'x1':evt.pageX, 'y1': evt.pageY});
                console.log(a_b[0]);
                console.log(a_b[1]);
                let first_line = createLine(a_b);
                $(this).parent().append(first_line);
            }
            if (click_counter === 3){
                four_points.bottom_right = [y_point, x_point];
                b_c.push({'x2':evt.pageX, 'y2': evt.pageY});
                c_d.push({'x1':evt.pageX, 'y1': evt.pageY});
                console.log(b_c);
                let second_line = createLine(b_c);
                $(this).parent().append(second_line);
            }
            if (click_counter === 4){
                four_points.bottom_left = [y_point, x_point];
                c_d.push({'x2':evt.pageX, 'y2': evt.pageY});
                let third_line = createLine(c_d);
                $(this).parent().append(third_line);
                d_a.push({'x2':evt.pageX, 'y2': evt.pageY});
                let fourth_line = createLine(d_a);
                console.log(fourth_line);
                $(this).parent().append(fourth_line);
            }
        });
    };
    function createLine(array){
        var length = Math.sqrt((array[0].x1-array[1].x2)*(array[0].x1-array[1].x2) + (array[0].y1-array[1].y2)*(array[0].y1-array[1].y2));
        var angle  = Math.atan2(array[1].y2 - array[0].y1, array[1].x2 - array[0].x1) * 180 / Math.PI;
        var transform = 'rotate('+angle+'deg)';
        var line = $('<div id="line">')
            .addClass('line')
            .css({
              'position': 'absolute',
              'transform': transform
            })
            .width(length)
            .offset({left: array[0].x1, top: array[0].y1});
        return line;
    }
    $scope.clearTransformation = ()=>{
        four_points = {};
        a_b = [];
        b_c = [];
        c_d = [];
        d_a = [];
        $scope.transforming = false;
        $("div[id^='line']").remove();
    };
    $scope.saveTransformation = ()=>{
        let active_img_id = $('#untransformed_list').find('.active')[0].text;
        let active_img = $('#untransformed-image'+active_img_id+'').find('img');
        let upload_file_name = active_img[0].attributes[0].value;
        let coords = valuesToArray(four_points);
        console.log(coords);
        TransformFileFactory.setTransformation(upload_file_name, coords, project_id).then( (response)=>{
            console.log(response);
            Materialize.toast('Transformation Saved', 1000);
            $scope.transforming = false;
        });
    };
    function valuesToArray(obj) {
      return Object.keys(obj).map(key => obj[key]);
    }
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
    //TEXT PROCESS
    $scope.processTextTesseract = ()=>{
        let active_file_id = $('#transformed_list').find('.active')[0].text;
        let active_file = $('#transformed-image'+active_file_id+'').find('img');
        let active_id = active_file[0].id;
        console.log("active_id", active_id);
        $location.path('/projects/processtext/tesseract/' + active_id);   
    };
    $scope.processTextGoogleVision = ()=>{
        let active_file_id = $('#transformed_list').find('.active')[0].text;
        let active_file = $('#transformed-image'+active_file_id+'').find('img');
        let active_id = active_file[0].id;
        console.log("active_id", active_id);
        $location.path('/projects/processtext/googlevision/' + active_id);   
    };
    $scope.processImage = ()=>{
        let active_file_id = $('#transformed_list').find('.active')[0].text;
        let active_file = $('#transformed-image'+active_file_id+'').find('img');
        let active_id = active_file[0].id;
        $location.path('/projects/processimage/' + active_id);   
    };
});
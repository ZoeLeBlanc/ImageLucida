"use strict";
myApp.controller("TransformFileCtrl", function($scope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, FileFactory, SourceFactory, GroupFactory, TextFileFactory){
    //Values
    $scope.transforming = false;
    $scope.untransformed_files = {};
    $scope.transformed_files = {};
    let untransformed_list = [];
    let transformed_list = [];
    let four_points = {};
    $scope.showTabs = false;
    $scope.allTabContentLoaded = false;
    $scope.selected_project = false;
    $scope.meta_data = false;
    $scope.info = {};
    $scope.info.coverPage = false;
    $scope.info.pageNumber = 0;
    // Upload SECTION
    const loadData = ()=>{
        UploadFileFactory.getUntransformedFiles().then( (response)=>{
            if (response.error === "No uploaded files."){
                console.log('no files');
            } else {
                $scope.untransformed_files = JSON.parse(response.untransformed_files);
                untransformed_list = response.untransformed_list;
                angular.forEach($scope.untransformed_files, (obj, index)=>{
                    obj.fields.id = obj.pk;
                    angular.forEach(untransformed_list, (item, index)=>{
                        if(obj.fields.upload_file_name === item[0]){
                            obj.fields.url = item[1];
                        }
                        if(obj.fields.upload_file_name === item[1]){
                            obj.fields.url = item[0];
                        }
                    });
                });
            }
            FileFactory.getUnassignedFiles().then((response)=>{
                if (response.error === "No files."){
                    $scope.allTabContentLoaded = true;
                    $scope.showTabs = true;
                } else {
                    $scope.transformed_files = JSON.parse(response.transformed_files);
                    transformed_list = response.transformed_list;
                    angular.forEach($scope.transformed_files, (obj, index)=>{
                        obj.fields.id = obj.pk;
                        // console.log("obj", obj);
                        angular.forEach(transformed_list, (item, index)=>{
                            // console.log("item",item);
                            if(obj.fields.transform_file_name === item[0]){
                                obj.fields.url = item[1];
                            }
                            if(obj.fields.transform_file_name === item[1]){
                                obj.fields.url = item[0];
                            }
                        });
                    });
                    $scope.allTabContentLoaded = true;
                    $scope.showTabs = true;
                }

            });
        });

    };
    loadData();
    $scope.deleteUploadedFile = ()=>{
        let active_img_id = $('#untransformed_list').find('.active')[0].text;
        let active_img = $('#untransformed-image'+active_img_id+'').find('img');
        let img_id = active_img[0].id;
        UploadFileFactory.deleteUploadFile(img_id).then( (response)=>{
            console.log(response);
            Materialize.toast('Image Deleted', 1000);
            $window.location.reload();
        });
    };
    $scope.duplicateUploadedFile = ()=>{
        let active_img_id = $('#untransformed_list').find('.active')[0].text;
        let active_img = $('#untransformed-image'+active_img_id+'').find('img');
        let img_id = active_img[0].id;
        UploadFileFactory.duplicateUploadFile(img_id).then( (response)=>{
            console.log(response);
            Materialize.toast('Image Duplicated', 1000);
            $window.location.reload();
        });
    };
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
        console.log(active_img);
        let height = active_img[0].naturalHeight;
        let width = active_img[0].naturalWidth;
        let upload_file_id = active_img[0].id;
        let upload_file_name = active_img[0].attributes[0].value;
        let coords = valuesToArray(four_points);
        console.log(coords, upload_file_name);
        // FileFactory.createFile(upload_file_id, upload_file_name, coords, height, width).then( (response)=>{
        //     console.log(response);
        //     Materialize.toast('Transformation Saved', 1000);
        //     $scope.transforming = false;
        //     // $window.location.reload();
        // });
    };
    function valuesToArray(obj) {
      return Object.keys(obj).map(key => obj[key]);
    }
    $scope.deleteTransformedFile = ()=>{
        let active_img_id = $('#transformed_list').find('.active')[0].text;
        let active_img = $('#transformed-image'+active_img_id+'').find('img');
        let img_id = active_img[0].id;
        FileFactory.deleteFile(img_id).then( (response)=>{
            console.log(response);
            Materialize.toast('Image Deleted', 1000);
            $window.location.reload();
        });
    };
    $scope.duplicateTransformedFile = ()=>{
        let active_img_id = $('#transformed_list').find('.active')[0].text;
        let active_img = $('#transformed-image'+active_img_id+'').find('img');
        let img_id = active_img[0].id;
        FileFactory.duplicateFile(img_id).then( (response)=>{
            console.log(response);
            Materialize.toast('Image Duplicated', 1000);
            $window.location.reload();
        });
    };
    $scope.untransformFile = ()=>{
        let active_img_id = $('#transformed_list').find('.active')[0].text;
        let active_img = $('#transformed-image'+active_img_id+'').find('img');
        let img_id = active_img[0].id;
        FileFactory.untransformFile(img_id).then( (response)=>{
            console.log(response);
            Materialize.toast('Image Untransformed', 1000);
            $window.location.reload();
        });
    };
    // Project and Folder Sections
    $scope.projects = [];
    ProjectsFactory.getProjects().then((response)=>{
        console.log(response);
        if (response.error){
            $scope.projects = [];
        }
        else {
            angular.forEach(response, (project, index)=>{
                project.fields.id = project.pk;
                console.log(project);
                $scope.projects.push(project.fields);
            });
        }
    });

    $scope.get_folders = (select_project) =>{
        $scope.folders = [];
        console.log(select_project);
        ProjectsFactory.getSingleProject(select_project).then( (response)=>{
            let folders = JSON.parse(response.folders);
            console.log(folders);
            angular.forEach(folders, (obj, index)=>{
                obj.fields.id = obj.pk;
                $scope.folders.push(obj.fields);
            });
            console.log($scope.folders);
            $scope.selected_project = true;
        });
    };
    // $scope.coverPage = true;
    $scope.saveFile = (select_project, select_folder) =>{
        let project_id = select_project;
        let folder_id = select_folder;
        let active_file_id = $('#transformed_list').find('.active')[0].text;
        let active_file = $('#transformed-image'+active_file_id+'').find('img');
        console.log(select_folder, select_project, active_file);
        let transform_file_name = active_file[0].attributes[0].value;
        let transform_file_id = active_file[0].id;
        console.log($scope.info);
        // FileFactory.assignTransformFile(transform_file_id, project_id, folder_id, $scope.info.coverPage, $scope.info.pageNumber).then((response)=>{
        //     console.log("response", response);
        //     Materialize.toast('File Error', 1000);
        // });
    };
   $scope.addMetaData = ()=>{
        let active_img_id = $('#transformed_list').find('.active')[0].text;
        let active_file = $('#transformed-image'+active_img_id+'').find('img');
        let active_id = active_file[0].id;
        console.log(active_id);
        let url = '#!/projects/meta-data/'+ active_id.toString();
        console.log(url);
        $window.location.href = url;
   };

});

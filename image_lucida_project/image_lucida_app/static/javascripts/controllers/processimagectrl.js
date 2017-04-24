"use strict";
myApp.controller("ProcessImageCtrl", function($scope, $rootScope, $location, $routeParams, $window, UserFactory, TextAnnotationFactory, TransformFileFactory, ImageAnnotationFactory){
    let transform_file_id = $routeParams.active_id;
    $scope.annotating= false;
    $scope.loaddata=false;
    let four_points = {};
    console.log(transform_file_id);
    TransformFileFactory.getSingleTransformFile(transform_file_id).then( (response)=>{
        let transform_file = JSON.parse(response.transform_file_serialize);
        $scope.transform_file = transform_file[0].fields;
        $scope.transform_file.id = transform_file[0].pk;
        $scope.transform_file.url = response.transform_file_url;
        $scope.imageSrc = response.transform_file_url;
        console.log($scope.imageSrc);
        $scope.loaddata=true;
         //IMAGE ANNOTATION TEST
        $scope.points = [[]];
        // $scope.imageSrc = "https://cloud.githubusercontent.com/assets/121322/18649301/a9740512-7e73-11e6-8db1-e266cd1c2a3b.jpg";
        $scope.enabled = true;
        $scope.colorArray = ['#FF0000', '#FFFF00', '#0000FF', '#008000', '#C0C0C0'];
        $scope.activePolygon = 0;
    });
    let a_b = [];
    let b_c = [];
    let c_d = [];
    let d_a = [];
    $scope.startAnnotation = () =>{
        $scope.annotating = true;
        let active_img = $('#transform-img');
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
                // $(this).parent().append(`<div class="col s2" id="marker"><img src="/static/top_left_marker.png" class="responsive-img" style="width:1em;height:auto;position:absolute; left:${evt.pageX};top:${evt.pageY}" /></div>`);
                a_b.push({'x1':evt.pageX, 'y1': evt.pageY});
                d_a.push({'x1':evt.pageX, 'y1': evt.pageY});
                
            }
            if (click_counter === 2){
                four_points.top_right = [y_point, x_point];
                // $(this).parent().append(`<div class="col s2" id="marker"><img src="/static/top_right_marker.png" class="responsive-img" style="width:1em;height:auto;position:absolute; left:${evt.pageX};top:${evt.pageY}" /></div>`);
                a_b.push({'x2':evt.pageX, 'y2': evt.pageY});
                b_c.push({'x1':evt.pageX, 'y1': evt.pageY});
                console.log(a_b[0]);
                console.log(a_b[1]);
                let first_line = createLine(a_b);
                $(this).parent().append(first_line);
            }
            if (click_counter === 3){
                four_points.bottom_right = [y_point, x_point];
                // $(this).parent().append(`<div class="col s2" id="marker"><img src="/static/bottom_right_marker.png" class="responsive-img" style="width:1em;height:auto;position:absolute; left:${evt.pageX};top:${evt.pageY}" /></div>`);
                b_c.push({'x2':evt.pageX, 'y2': evt.pageY});
                c_d.push({'x1':evt.pageX, 'y1': evt.pageY});
                console.log(b_c);
                let second_line = createLine(b_c);
                $(this).parent().append(second_line);
            }
            if (click_counter === 4){
                four_points.bottom_left = [y_point, x_point];
                // $(this).parent().append(`<div class="col s2" id="marker"><img src="/static/bottom_left_marker.png" class="responsive-img" style="width:1em;height:auto;position:absolute; left:${evt.pageX};top:${evt.pageY}" /></div>`);
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
    $scope.clearAnnotation = ()=>{
        four_points = {};
        a_b = [];
        b_c = [];
        c_d = [];
        d_a = [];
        $scope.annotating = false;
        $("div[id^='line']").remove();
    };
    $scope.saveAnnotation = ()=>{
        let active_img = $('#transform-img');
        console.log(active_img);
        let transform_file_name = active_img[0].attributes[0].value;
        console.log(transform_file_name);
        let coords = valuesToArray(four_points);
        console.log(coords);
        ImageAnnotationFactory.setImageTransformation(transform_file_name, coords).then( (response)=>{
            console.log(response);
            Materialize.toast('Image Annotation Saved', 1000);
            $scope.annotating = false;
            $("div[id^='line']").remove();
            $window.location.reload();
        });
    };
    function valuesToArray(obj) {
      return Object.keys(obj).map(key => obj[key]);
    }
    $scope.go_back = function() { 
        $window.history.back();
    };
    //Image Annotation Process Section
    let images;
    let images_urls;
    ImageAnnotationFactory.getImageAnnotations(transform_file_id).then( (response)=>{
        console.log('response', JSON.parse(response.images));
        images_urls = response.image_urls;
        $scope.image_annotations = JSON.parse(response.images);
        angular.forEach($scope.image_annotations, (image, index)=>{
            image.fields.id = image.pk;
            angular.forEach(images_urls, (url, index)=>{
                if (image.fields.image_annotation_file_name == url[0]){
                    image.fields.url = url[1];
                }
                if (image.fields.image_annotation_file_name == url[1]){
                    image.fields.url = url[0];
                }
            });
        });
    });
    $scope.processImage = ()=>{
        let active_id = $('#image_list').find('.active')[0].text;
        // let active_img = $('#image_annotation'+active_img_id).find('img');
        // console.log(active_img);
        // let active_id = active_img[0].id;
        active_id = parseInt(active_id) + 1;
        console.log("active_id", active_id);
        ImageAnnotationFactory.processImage(active_id).then( (response)=>{
            console.log(response.image_annotation);
            console.log(response.palette_url);
            angular.forEach($scope.image_annotations, (image, index)=>{
                if (response.image_annotation.pk == image.id ){
                    image.palette_url = response.palette_url;
                }
            });
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
        console.log($scope.points);
    };
    $scope.savePolygons = function () {
        console.log($scope.points);
    };
});
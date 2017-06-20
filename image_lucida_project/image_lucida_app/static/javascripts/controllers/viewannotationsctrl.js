"use strict";
myApp.controller("ViewAnnotationsCtrl", function($scope, $location, $routeParams, $window, UserFactory, ProjectsFactory, UploadFileFactory, TransformFileFactory, ArchivalSourceFactory, IssueFactory, TextAnnotationFactory, FoldersFactory, ImageAnnotationFactory){
    // FOLDer SECTION
    let transform_file_id = $routeParams.active_id;
    $scope.transformed_file = {};
    $scope.text_annotation = {};
    $scope.image_annotations = {};
    $scope.all_tags = {};
    $scope.showTabs = false;
    $scope.allTabContentLoaded = false;
    $scope.editing = false;
    let image_annotations_list = [];
    ImageAnnotationFactory.getImageAnnotations(transform_file_id).then( (response)=>{
        // console.log(response);
        let images_data = response.images_data;
        // console.log(images_data);
        $scope.image_annotations = JSON.parse(response.images);
        angular.forEach($scope.image_annotations, (image, index)=>{
            image.fields.id = image.pk;
            angular.forEach(images_data, (item, index)=>{
                if(image.fields.image_annotation_file_name === item.image_name){
                    image.fields.url = item.image_url;
                    if(image.fields.google_vision_processed || image.fields.tesseract_processed) {
                        ImageAnnotationFactory.getImageAnnotationsTexts(image.fields.id).then( (response)=>{
                            let texts = JSON.parse(response.texts);
                            image.fields.texts = texts[0];
                        });
                    } else {
                        image.fields.texts = [];
                    }
                    console.log(item.image_tags.length);
                    console.log(item.image_tags);   
                    if(item.image_tags.length > 0){
                        image.fields.tags = JSON.parse(item.image_tags);
                        console.log(image.fields.tags);
                    } else {
                        image.fields.tags = [];
                    }
                }
            });
        });
        console.log($scope.image_annotations);
        $scope.allTabContentLoaded = true;
        $scope.showTabs = true;
    });
    $scope.go_back = function() { 
        $window.history.back();
    };
    $scope.tabClick = function(index){
        console.log(index);
        $scope.all_tags = {};
        let active_img = $('#image_annotations'+index+'').find('img');
        console.log(active_img);
        let img_id = active_img[0].id;
        console.log(img_id);
        let data = [];
        angular.forEach($scope.image_annotations, (image, value)=>{
            console.log(img_id);
            if(img_id == image.pk){
                console.log(image.fields.tags);
                if (Object.keys(image.fields.tags).length > 0 ){
                    angular.forEach(image.fields.tags, (item, index)=>{
                        console.log(item);
                        data.push({tag:item.fields.tag_name});
                        $scope.all_tags[index] = {tag:item.fields.tag_name};
                    });
                    $('.chips-initial').material_chip({data});
                } else {
                    $scope.all_tags = {};
                    $('.chips').material_chip();
                }
            }
        });
        
    };
    $scope.editTesseractText = ()=>{
        $scope.editing = true;
    };
    $scope.saveTesseractEdits = (image)=>{
        console.log(image);
        let new_text = $('#edited-tesseract'+image.pk)[0].textContent;
        TextAnnotationFactory.updateTextAnnotation(image.fields.texts.pk, new_text, 'tesseract').then( (response)=>{
            console.log(response);
            Materialize.toast('Edits Saved', 1000);
            $scope.editing = false; 
        });
    };
     $scope.editGoogleVisionText = ()=>{
        $scope.editing = true;
    };
    $scope.saveGoogleVisionEdits = (image)=>{
        console.log(image.fields.texts.pk);
        let new_text = $('#edited-googlevision'+image.pk)[0].textContent;
        console.log(new_text);
        TextAnnotationFactory.updateTextAnnotation(image.fields.texts.pk, new_text, 'googlevision').then( (response)=>{
            console.log(response);
            Materialize.toast('Edits Saved', 1000);
            $scope.editing = false; 
        });
    };
    
    $scope.saveImage = (image)=>{
        let all_tags = [];
        let data = $('.chips').find('.chip');
        if (data.length === 0){
            data = $('.chips-initial').find('.chip');
        }
        console.log(image);
        angular.forEach(data, (value, index)=>{
            let string = value.innerText;
            let substring = string.split('close');
            console.log(substring[0]);
            all_tags.push({
                'tag':substring[0],
            });
        });
        console.log(all_tags);
        angular.forEach(all_tags, (tag, index)=>{
            ImageAnnotationFactory.tagImageAnnotation(image.pk, tag.tag).then( (response)=>{
                console.log(response);
            });
        });
    };
});
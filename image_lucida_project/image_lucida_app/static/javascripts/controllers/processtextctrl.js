"use strict";
myApp.controller("ProcessTextCtrl", function($scope, $rootScope, $location, $routeParams, $window, UserFactory, TextAnnotationFactory, TransformFileFactory){
    let transform_file_id = $routeParams.active_id;
    $scope.active_id = transform_file_id;
    let current_path = $location.path();
    // let text_anno = {};
    let transform_file = {};
    $scope.editing = false;
    let text_anno_id;
    $scope.transform_file = {};
    TransformFileFactory.getSingleTransformFile(transform_file_id).then( (response)=>{
        console.log(response);
        let transform_file = JSON.parse(response.transform_file);
        console.log(transform_file);
        $scope.transform_file = transform_file[0].fields;
        $scope.transform_file.id = transform_file[0].pk;
        $scope.transform_file.url = response.transform_file_url;
        let texts = JSON.parse(response.texts_serialize);
        angular.forEach(texts, (text, index)=>{
            $scope.transform_file.google_vision_text_annotation = text.fields.google_vision_text_annotation;
            $scope.transform_file.tesseract_text_annotation = text.fields.tesseract_text_annotation;
            
        });
        
        console.log($scope.transform_file);
    });
    
    $scope.editTesseractText = ()=>{
        $scope.editing = true;
    };
    $scope.saveTesseractEdits = ()=>{
        console.log($scope.tesseract);
        let new_text = $('#edited-tesseract')[0].textContent;
        TextAnnotationFactory.updateTextAnnotation(text_anno_id, new_text, 'tesseract').then( (response)=>{
            console.log(response);
            Materialize.toast('Edits Saved', 1000);
            $scope.editing = false; 
            $window.location.reload();
        });
    };
     $scope.editGoogleVisionText = ()=>{
        $scope.editing = true;
    };
    $scope.saveGoogleVisionEdits = ()=>{
        console.log($scope.tesseract);
        let new_text = $('#edited-googlevision')[0].textContent;
        TextAnnotationFactory.updateTextAnnotation(text_anno_id, new_text, 'googlevision').then( (response)=>{
            console.log(response);
            Materialize.toast('Edits Saved', 1000);
            $scope.editing = false;
            $window.location.reload(); 
        });
    };
    $scope.go_back = function() { 
        $window.history.back();
    };
    //TEXT PROCESS
    $scope.processGoogleVision = ()=>{
        let process_type = 'googlevision';
        TextAnnotationFactory.processText(transform_file_id, process_type).then( (response)=>{
            Materialize.toast('Text Processed', 1000);
            console.log(response); 
        });
    };
    $scope.processTesseract = ()=>{
        let process_type = 'tesseract';
        TextAnnotationFactory.processText(transform_file_id, process_type).then( (response)=>{
            Materialize.toast('Text Processed', 1000);
            console.log(response); 
        }); 
    };
});
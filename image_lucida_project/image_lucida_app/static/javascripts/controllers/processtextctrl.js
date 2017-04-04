"use strict";
myApp.controller("ProcessTextCtrl", function($scope, $rootScope, $location, $routeParams, $window, UserFactory, TextAnnotationFactory, TransformFileFactory){
    let transform_file_id = $routeParams.active_id;
    let text_anno = {};
    let transform_file = {};
    $scope.editing = false;
    let text_anno_id;
    TextAnnotationFactory.processText(transform_file_id).then( (response)=>{
            Materialize.toast('Text Processed', 1000);
            console.log(response[0]);
            text_anno_id = response[0].pk;
            TextAnnotationFactory.getSingleTextAndFile(text_anno_id).then( (response)=>{
                console.log(response);
                text_anno = JSON.parse(response.text_anno);
                $scope.text_anno = text_anno[0].fields;
                $scope.text_anno.id = text_anno[0].pk;
                transform_file = JSON.parse(response.transform_file);
                $scope.transform_file = transform_file[0].fields;
                $scope.transform_file.id = transform_file[0].pk;
                $scope.transform_file.url = response.transform_file_url;
        });  
    });
    $scope.editText = ()=>{
        $scope.editing = true;
    };
    $scope.saveEdits = ()=>{
        let new_text = $('#edited')[0].textContent;
        console.log(new_text);
        TextAnnotationFactory.updateTextAnnotation(text_anno_id, new_text).then( (response)=>{
            console.log(response);
            Materialize.toast('Edits Saved', 1000);
            $scope.editing = false; 
        });
    };
    $scope.go_back = function() { 
        $window.history.back();
    };
});
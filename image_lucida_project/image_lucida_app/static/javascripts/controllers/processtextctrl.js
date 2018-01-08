"use strict";
myApp.controller("ProcessTextCtrl", function($scope, $rootScope, $location, $routeParams, $window, TextFileFactory, FileFactory){
    $scope.editing = false;
    let text_file_id;
    $scope.file = {};
    FileFactory.getSingleFile($rootScope.file_id).then( (response)=>{
        console.log(response);
        let file = JSON.parse(response.file);
        $scope.file = file[0].fields;
        $scope.file.file_url = response.file_url;
        $scope.file.id = file[0].pk;
        let texts = response.texts_serialize;
        angular.forEach(texts, (text, index)=>{
            $scope.file.google_vision_text_annotation = text.fields.google_vision_text_annotation;
            $scope.file.tesseract_text_annotation = text.fields.tesseract_text_annotation;

        });

        console.log($scope.file);
    });

    $scope.editTesseractText = ()=>{
        $scope.editing = true;
    };
    $scope.saveTesseractEdits = (text_file_id)=>{
        console.log($scope.tesseract);
        let new_text = $('#edited-tesseract')[0].textContent;
        TextFileFactory.updateTextFile(text_file_id, new_text, 'tesseract').then( (response)=>{
            console.log(response);
            Materialize.toast('Edits Saved', 1000);
            $scope.editing = false;
            $window.location.reload();
        });
    };
     $scope.editGoogleVisionText = ()=>{
        $scope.editing = true;
    };
    $scope.saveGoogleVisionEdits = (text_file_id)=>{
        console.log($scope.tesseract);
        let new_text = $('#edited-googlevision')[0].textContent;
        TextFileFactory.updateTextFile(text_file_id, new_text, 'googlevision').then( (response)=>{
            console.log(response);
            Materialize.toast('Edits Saved', 1000);
            $scope.editing = false;
            // $window.location.reload();
        });
    };
    $scope.go_back = function() {
        $window.history.back();
    };
    //TEXT PROCESS
    $scope.processGoogleVision = ()=>{
        let process_type = 'googlevision';
        TextFileFactory.processText($rootScope.file_id, process_type).then( (response)=>{
            Materialize.toast('Text Processed', 1000);
            console.log(response);
        });
    };
    $scope.processTesseract = ()=>{
        let process_type = 'tesseract';
        TextFileFactory.processText($scope.file.id, process_type).then( (response)=>{
            Materialize.toast('Text Processed', 1000);
            console.log(response);
        });
    };
});

"use strict";
myApp.controller("ProcessTextCtrl", function($scope, $rootScope, $location, $routeParams, $window, TextFileFactory, FileFactory){
    $scope.editing = false;
    $scope.file = {};
    FileFactory.getSingleFile($rootScope.file_id).then( (response)=>{
        console.log(response);
        let file = JSON.parse(response.file);
        $scope.file = file[0].fields;
        $scope.file.file_url = response.file_url;
        $scope.file.id = file[0].pk;
        let texts = response.texts_serialize;
        if (texts.length > 0 ){
            angular.forEach(JSON.parse(texts), (text, index)=>{
                console.log(text);
                $scope.file.google_vision_text = text.fields.google_vision_text;
                $scope.file.google_vision_text_id = text.pk;
                $scope.file.tesseract_text = text.fields.tesseract_text;
                $scope.file.tesseract_text_id = text.pk;

            });
        }
        console.log($scope.file);
    });

    $scope.editText = ()=>{
        $scope.editing = !$scope.editing;
    };
    $scope.saveTesseractEdits = ()=>{
        let new_text = $('#edited-tesseract')[0].textContent;
        TextFileFactory.updateTextFile($scope.file.tesseract_text_id, new_text, 'tesseract').then( (response)=>{
            console.log(response);
            Materialize.toast('Edits Saved', 1000);
            $scope.editing = false;
        });
    };
    $scope.saveGoogleVisionEdits = ()=>{
        let new_text = $('#edited-googlevision')[0].textContent;
        TextFileFactory.updateTextFile($scope.file.google_vision_text_id, new_text, 'googlevision').then( (response)=>{
            console.log(response);
            Materialize.toast('Edits Saved', 1000);
            $scope.editing = false;
        });
    };
    $scope.go_back = function() {
        $window.history.back();
    };
    //TEXT PROCESS
    $scope.processGoogleVision = ()=>{
        let process_type = 'googlevision';
        TextFileFactory.processText($rootScope.file_id, process_type).then( (response)=>{
            $scope.file.google_vision_text = response[0].google_vision_text;
            $scope.file.google_vision_text_id = response[0].pk;
            Materialize.toast('Text Processed', 1000);
            console.log(response);
        });
    };
    $scope.processTesseract = ()=>{
        let process_type = 'tesseract';
        console.log($scope.file.id, process_type);
        TextFileFactory.processText($scope.file.id, process_type).then( (response)=>{
            $scope.file.tesseract_text = response[0].tesseract_text;
            $scope.file.tesseract_text_id = response[0].pk;
            Materialize.toast('Text Processed', 1000);
            console.log(response);
        });
    };
});

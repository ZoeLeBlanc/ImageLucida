"use strict";
myApp.controller("ViewTextsCtrl", function($scope, $rootScope, $location, $routeParams, $window, TextFileFactory, FileFactory){
    $scope.editing = false;
    $scope.file = {};
    FileFactory.getSingleFile($rootScope.file_id).then( (response)=>{
        console.log(response);
        let file = JSON.parse(response.file);
        $scope.file = file[0].fields;
        $scope.file.file_url = response.file_url;
        $scope.file.id = file[0].pk;
        let texts = response.texts_serialize;
        let tags = response.tags_serialize;
        if (texts.length > 0 ){
            angular.forEach(JSON.parse(texts), (text, index)=>{
                console.log(text);
                $scope.file.google_vision_text = text.fields.google_vision_text;
                $scope.file.google_vision_text_id = text.pk;
                $scope.file.tesseract_text = text.fields.tesseract_text;
                $scope.file.tesseract_text_id = text.pk;

            });
        }
        if (tags.length > 0){
            let all_tags = '';
            angular.forEach(JSON.parse(tags), (item, index)=>{
                all_tags += item.fields.tag_name +', ';
            });
            $scope.file.tags = all_tags;
        }
        console.log($scope.file);
        var $window = $(window),
            $imageInfo = $('#textInfo'),
            elTop = $imageInfo.offset().top;

         $window.scroll(function() {
              $imageInfo.toggleClass('sticky', $window.scrollTop() > elTop);
         });
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
    //TEXT PROCESS
    $scope.processGoogleVision = ()=>{
        let process_type = 'googlevision';
        TextFileFactory.processText($rootScope.file_id, process_type).then( (response)=>{
            if (response.length > 0){
                $scope.file.google_vision_text = response[0].fields.google_vision_text;
                $scope.file.google_vision_text_id = response[0].pk;
                Materialize.toast('Text Processed', 1000);
                console.log(response);
            }

        });
    };
    $scope.processTesseract = ()=>{
        let process_type = 'tesseract';
        console.log($scope.file.id, process_type);
        TextFileFactory.processText($scope.file.id, process_type).then( (response)=>{
            if (response.length>0){
                $scope.file.tesseract_text = response[0].fields.tesseract_text;
                $scope.file.tesseract_text_id = response[0].pk;
                Materialize.toast('Text Processed', 1000);
                console.log(response);
            }

        });
    };
    $scope.tagFile = function(){
        $scope.file.tags.split(',').map( (tag)=> {
            FileFactory.tagFile($scope.file.id, tag.toLowerCase()).then((response)=>{
                Materialize.toast('Tag Added', 200);
                console.log(response);
            });
        });

    };
});

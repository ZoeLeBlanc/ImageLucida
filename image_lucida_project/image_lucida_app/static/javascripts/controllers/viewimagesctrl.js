"use strict";
myApp.controller("ViewImagesCtrl", function($scope, $rootScope, $location, $routeParams, $window, $q, UserFactory, FileFactory, TextFileFactory, ImageFileFactory){
    $scope.file = {};
    $scope.images = [];
    $scope.auto_image = false;
    $scope.loaddata = false;
    $scope.process_type = {};
    $scope.editing = false;
    $scope.clickedImage = false;
    var getFile = () => {
        FileFactory.getSingleFile($rootScope.file_id).then( (response)=>{
            $scope.images = [];
            let file = JSON.parse(response.file);
            let base_file = JSON.parse(response.base_file);
            $scope.file = file[0].fields;
            $scope.file.file_url = response.file_url;
            $scope.file.id = file[0].pk;
            $scope.imageSrc = response.file_url;
            $scope.loaddata=true;
             //IMAGE ANNOTATION TEST
            $scope.points = [[]];
            // $scope.imageSrc = "https://cloud.githubusercontent.com/assets/121322/18649301/a9740512-7e73-11e6-8db1-e266cd1c2a3b.jpg";
            $scope.enabled = true;
            $scope.colorArray = ['#FF0000', '#FFFF00', '#0000FF', '#008000', '#C0C0C0'];
            $scope.activePolygon = 0;
            let images = response.images_serialize;
            let images_data = response.images_data;
            angular.forEach(JSON.parse(images), (obj, index)=>{
                obj.fields.id = obj.pk;
                angular.forEach(images_data, (item, index)=>{
                    if(obj.fields.image_file_name === item.image_name){
                        obj.fields.url = item.image_url;
                        obj.fields.tags = item.tags;
                    }
                });
                $scope.images.push(obj.fields);
            });
        });
    };
    getFile();
    ImageFileFactory.autoImageSegmentation($rootScope.file_id).then((response)=>{
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
        getFile();
        var $window2 = $(window),
            $imageInfo = $('#segmentInfo'),
            elTop = $imageInfo.offset().top;

         $window2.scroll(function() {
              $imageInfo.toggleClass('sticky', $window2.scrollTop() > elTop);
         });
    });
    $scope.deleteImageFile = function(image_file_id) {
        ImageFileFactory.deleteImageFile(image_file_id).then((response)=>{
            getFile();
        });
    };
    $scope.tagImage = function(image_file_id){
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
        let image = $scope.images.filter((image)=>{
            return image.id === image_file_id;
        });
        let tags = $('#tags'+image_file_id).val().split(',');
        tags.map( (tag)=> {
            ImageFileFactory.tagImageFile(image_file_id, tag.toLowerCase()).then((response)=>{
                $('.preloader-wrapper').toggleClass('active');
                $('#preloader').toggleClass('preloader-background');
                Materialize.toast('Tag Saved', 200);
                console.log(response);
            });
        });

    };
    $scope.orderImage = function(image_file_id){
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
        let image = $scope.images.filter((image)=>{
            return image.id === image_file_id;
        });
        let image_order = $('#image_order'+image_file_id).val();
        ImageFileFactory.orderImage(image_file_id, parseInt(image_order)).then((response)=>{
            $('.preloader-wrapper').toggleClass('active');
            $('#preloader').toggleClass('preloader-background');
            Materialize.toast('Order Saved', 200);
            console.log(response);
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
    };
    $scope.savePolygons = function () {
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
        let width = $('canvas')[0].width;
        let height = $('canvas')[0].height;
        let ocr = false;
        let process_type = 'None';
        if ($scope.process_type.googlevision || $scope.process_type.tesseract) {
            ocr = true;
            process_type = Object.keys($scope.process_type)[0];
        }
        var promises = [];
        let counter = $scope.images.length;
        angular.forEach($scope.points, (array, index)=>{
            if(array.length > 0){
                counter++;
                let outsideArray = [];
                outsideArray.push(array);
                var promise = ImageFileFactory.manualSegmentation($rootScope.file_id, outsideArray, ocr, process_type, height, width, counter).then((response)=>{
                    return response;
                 });
                promises.push(promise);
            }
        });
        $q.all(promises).then( (response)=>{
            console.log(response);
            $('.preloader-wrapper').toggleClass('active');
            $('#preloader').toggleClass('preloader-background');
            Materialize.toast('Images Saved', 1000);
            getFile();
        });
    };
    $scope.processGoogleVision = (image_file_id)=>{
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
        let process_type = 'googlevision';

        ImageFileFactory.processImageText(image_file_id, process_type).then( (response)=>{
            if (response.length > 0){
                $scope.images.map((image)=>{
                    if (image.id === image_file_id){
                        image.google_vision_text = response[0].fields.google_vision_text;
                        image.google_vision_text_id = response[0].pk;
                        return image;
                    }
                });
                $('.preloader-wrapper').toggleClass('active');
                $('#preloader').toggleClass('preloader-background');
                Materialize.toast('Text Processed', 1000);
            }

        });
    };
    $scope.processTesseract = (image_file_id)=>{
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
        let process_type = 'tesseract';
        ImageFileFactory.processImageText(image_file_id, process_type).then( (response)=>{
            if (response.length > 0){
                $scope.images.map((image)=>{
                    if (image.id === image_file_id){
                        image.tesseract_text = response[0].fields.tesseract_text;
                        image.tesseract_text_id = response[0].pk;
                        return image;
                    }
                });
                $('.preloader-wrapper').toggleClass('active');
                $('#preloader').toggleClass('preloader-background');
                Materialize.toast('Text Processed', 1000);
            }

        });
    };
    $scope.saveTesseractEdits = (image_file_id)=>{
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
        let new_text = $(`#edited-tesseract_${image_file_id}`)[0].textContent;
        $scope.images.map((image)=>{
            if (image.id === image_file_id){
                TextFileFactory.updateTextFile(image.text_file_id, new_text, 'tesseract').then( (response)=>{
                    console.log(response);
                    $('.preloader-wrapper').toggleClass('active');
                    $('#preloader').toggleClass('preloader-background');
                    Materialize.toast('Edits Saved', 1000);
                    $scope.editing = false;
                    getFile();
                });
            }
        });

    };
    $scope.saveGoogleVisionEdits = (image_file_id)=>{
        $('.preloader-wrapper').toggleClass('active');
        $('#preloader').toggleClass('preloader-background');
        let new_text = $(`#edited-googlevision_${image_file_id}`)[0].textContent;
        $scope.images.map((image)=>{
            if (image.id === image_file_id){
                TextFileFactory.updateTextFile(image.text_file_id, new_text, 'google_vision').then( (response)=>{
                    console.log(response);
                    $('.preloader-wrapper').toggleClass('active');
                    $('#preloader').toggleClass('preloader-background');
                    Materialize.toast('Edits Saved', 1000);
                    $scope.editing = false;
                    getFile();
                });
            }
        });
    };
    $scope.editText = ()=>{
        $scope.editing = !$scope.editing;
    };
    $scope.showImage = (image_file_id) => {
        ImageFileFactory.getSingleImageFile(image_file_id).then((response)=>{
            $scope.editing = false;
            $scope.clickedImage = false;
            let image = $scope.images.filter((image)=>{
                return image.id === image_file_id;
            });
            image = image[0];
            let tags = response.tags;
            let texts = JSON.parse(response.texts);
            image.image_file_url = response.image_file_url;
            if (texts.length > 0 ){
                image.text_file_id = texts[0].pk;
                if (texts[0].fields.google_vision_text !== null){
                    image.google_vision_text = texts[0].fields.google_vision_text;
                }
                if (texts[0].fields.tesseract_text !== null){
                    image.tesseract_text = texts[0].fields.tesseract_text;
                }
            }
            if (tags.length > 0){
                let all_tags = '';
                angular.forEach(JSON.parse(tags), (item, index)=>{
                    all_tags += item.fields.tag_name +', ';
                });
                image.tags = all_tags;
            }
            $scope.selectedImage = image;
            $("#imageArea").html('');
            $("#imageArea").append(`<img class="materialboxed responsive-img" src="${$scope.selectedImage.image_file_url}"/>`);

            $('.materialboxed').materialbox();
            $('.collapsible').collapsible();
            $scope.clickedImage = true;
            var $window = $(window),
                $imageInfo = $('#imageInfo'),
                elTop = $imageInfo.offset().top;

             $window.scroll(function() {
                  $imageInfo.toggleClass('sticky', $window.scrollTop() > elTop);
             });
        });

    };
});

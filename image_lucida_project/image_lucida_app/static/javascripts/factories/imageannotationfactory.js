"use strict";
angular.module('ImageLucidaApp').factory("ImageAnnotationFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        setImageTransformation: (transform_file_id, four_points) =>{
            return $http({
                url:`${rootUrl}/transform_image_annotations/`,
                method: 'POST',
                data: {
                    'transform_file_id': transform_file_id,
                    'four_points':four_points
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        getImageAnnotations: (transform_file_id) => {
            return $http.get(`${rootUrl}/get_image_annotations/${transform_file_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        processImage: (image_annotation_id) =>{
            console.log(image_annotation_id);
            return $http({
                url:`${rootUrl}/process_image_annotations/`,
                method: 'POST',
                data: {
                    'image_annotation_id': image_annotation_id
                }
            }).then((res)=>{
                console.log(res);
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        deleteImageAnnotation: (image_anno_id) => {
            return $http({
                url:`${rootUrl}/delete_image_annotation/`,
                method: 'DELETE',
                data: {
                    'image_anno_id':image_anno_id
                }
            }).then( (res)=>{
                console.log(JSON.parse(res));
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        tagImageAnnotation: (image_anno_id, tag_name)=>{
            console.log(image_anno_id, tag_name);
            return $http({
                url:`${rootUrl}/tag_images/`,
                method: 'POST',
                data: {
                    'image_anno_id': image_anno_id,
                    'tag_name':tag_name
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        manualSegmentation: (transform_file_id, multi_coords, ocr, process_type, height, width)=>{
            console.log(process_type);
            return $http({
                url:`${rootUrl}/manual_segmentation/`,
                method: 'POST',
                data: {
                    'transform_file_id': transform_file_id,
                    'multi_coords':multi_coords,
                    'ocr':ocr,
                    'process_type':process_type,
                    'height':height,
                    'width':width
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        autoImageSegmentation: (transform_file_id)=>{
            return $http({
                url:`${rootUrl}/auto_segment_image_annotation/`,
                method: 'POST',
                data: {
                    'transform_file_id': transform_file_id
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        getImageAnnotationsTexts:(image_anno_id)=>{
            return $http.get(`${rootUrl}/get_image_annotations_texts/${image_anno_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
    };
});
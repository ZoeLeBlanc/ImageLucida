"use strict";
angular.module('ImageLucidaApp').factory("ImageAnnotationFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        setImageTransformation: (transform_file_name, four_points) =>{
            return $http({
                url:`${rootUrl}/transform_image_annotations/`,
                method: 'POST',
                data: {
                    'transform_file_name': transform_file_name,
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
        updateTextAnnotation: (text_anno_id, new_text)=>{
            console.log(new_text);
            return $http({
                url:`${rootUrl}/update_text_annotation/`,
                method: 'POST',
                data: {
                    'text_anno_id': text_anno_id,
                    'new_text':new_text
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        addIssue: (transform_file_name, issue_id)=>{
            return $http({
                url:`${rootUrl}/add_issue/`,
                method: 'POST',
                data: {
                    'transform_file_name': transform_file_name,
                    'issue_id':issue_id
                }
            }).then((res)=>{
                console.log(JSON.parse(res));
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        }
    };
});
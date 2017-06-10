"use strict";
angular.module('ImageLucidaApp').factory("TextAnnotationFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getSingleTextAndFile: (text_anno_id) => {
            console.log(text_anno_id);
            return $http.get(`${rootUrl}/get_text_anno_and_file/${text_anno_id}/`)
            .then( (res)=>{
                console.log(res);
                return res.data;
            });
        },
        processText: (transform_file_id, process_type) =>{
            return $http({
                url:`${rootUrl}/process_text/`,
                method: 'POST',
                data: {
                    'transform_file_id': transform_file_id,
                    'process_type':process_type
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
        updateTextAnnotation: (text_anno_id, new_text, process_type)=>{
            console.log(new_text);
            return $http({
                url:`${rootUrl}/update_text_annotation/`,
                method: 'POST',
                data: {
                    'text_anno_id': text_anno_id,
                    'new_text':new_text,
                    'process_type':process_type
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        deleteTextAnnotation: (text_anno_id) => {
            return $http({
                url:`${rootUrl}/delete_text_annotation/`,
                method: 'DELETE',
                data: {
                    'text_anno_id':text_anno_id
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
        tagTextAnnotation: (text_anno_id, tag_name)=>{
            return $http({
                url:`${rootUrl}/tag_text_annotation/`,
                method: 'POST',
                data: {
                    'text_anno_id': text_anno_id,
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
        getTextAnnotations: (transform_file_id) => {
            return $http.get(`${rootUrl}/get_text_annotations/${transform_file_id}/`)
            .then( (res)=>{
                return res.data;
            });
        }
    };
});
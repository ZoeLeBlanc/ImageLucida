"use strict";
angular.module('ImageLucidaApp').factory("TextAnnotationFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getUntransformedFiles: () => {
            return $http.get(`${rootUrl}/get_untransformed_files/`)
            .then( (res)=>{
                return res.data;
            });
        },
        getSingleTextAndFile: (text_anno_id) => {
            console.log(text_anno_id);
            return $http.get(`${rootUrl}/get_text_anno_and_file/${text_anno_id}/`)
            .then( (res)=>{
                console.log(res);
                return res.data;
            });
        },
        processText: (transform_file_id) =>{
            return $http({
                url:`${rootUrl}/process_text/`,
                method: 'POST',
                data: {
                    'transform_file_id': transform_file_id
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
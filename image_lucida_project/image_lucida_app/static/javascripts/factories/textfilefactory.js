"use strict";
angular.module('ImageLucidaApp').factory("TextFileFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getSingleTextFile: (text_file_id) => {
            return $http.get(`${rootUrl}/get_single_text_file/${text_file_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        processText: (file_id, process_type) =>{
            return $http({
                url:`${rootUrl}/process_text/`,
                method: 'POST',
                data: {
                    'file_id': file_id,
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
        updateTextFile: (text_file_id, new_text, process_type)=>{
            console.log(new_text);
            return $http({
                url:`${rootUrl}/update_text_file/`,
                method: 'POST',
                data: {
                    'text_file_id': text_file_id,
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
        deleteTextFile: (text_file_id) => {
            return $http({
                url:`${rootUrl}/delete_text_file/`,
                method: 'DELETE',
                data: {
                    'text_file_id':text_file_id
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
    };
});

"use strict";
angular.module('ImageLucidaApp').factory("UploadFileFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getUploadedFiles: () => {
            return $http.get(`${rootUrl}/get_upload_files/`)
            .then( (res)=>{
                return res.data;
            });
        },
        uploadFile: (file, width, height) =>{
            let fd = new FormData();
            console.log(file);
            fd.append('base_file', file);
            fd.append('base_file_name', file.name);
            fd.append('base_file_height', height);
            fd.append('base_file_width', width);
            console.log(fd);
            return $http({
                url:`${rootUrl}/upload_file/`,
                method: 'POST',
                data: fd,
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).then((res)=>{
                console.log(res);
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        uploadProcessFile: (file, width, height, project_id, folder_id, bucket_id, source_id, contains_image, translate_text, ocr_text) => {
            let fd = new FormData();
            console.log(file);
            fd.append('base_file', file);
            fd.append('base_file_name', file.name);
            fd.append('base_file_height', height);
            fd.append('base_file_width', width);
            fd.append('project_id', project_id);
            fd.append('folder_id', folder_id);
            fd.append('bucket_id', bucket_id);
            fd.append('source_id', source_id);
            fd.append('contains_image', contains_image);
            fd.append('translate_text', translate_text);
            fd.append('ocr_text', ocr_text);
            
            console.log(fd);
            return $http({
                url: `${rootUrl}/upload_process_file/`,
                method: 'POST',
                data: fd,
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).then((res) => {
                console.log(res);
                return res.data;
            }, (res) => {
                if (res.status > 0) {
                    return res.status;
                }
            });
        },
        deleteUploadFile: (upload_file_id) => {
            console.log(upload_file_id);
            return $http({
                url:`${rootUrl}/delete_uploaded_file/`,
                method: 'DELETE',
                data: {
                    'upload_file_id':upload_file_id
                }
            }).then((res) => {
                console.log(JSON.parse(res));
                return res.data;
            }, (res) => {
                if (res.status > 0) {
                    return res.status;
                }
            });
        },
        duplicateUploadFile: (upload_file_id) => {
            return $http({
                url:`${rootUrl}/duplicate_upload_file/`,
                method: 'POST',
                data: {
                    'upload_file_id':upload_file_id
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

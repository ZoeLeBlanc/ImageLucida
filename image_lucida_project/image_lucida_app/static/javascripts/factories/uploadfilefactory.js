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
        deleteUploadFile: (upload_file_id) => {
            console.log(upload_file_id);
            return $http({
                url:`${rootUrl}/delete_uploaded_file/`,
                method: 'DELETE',
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

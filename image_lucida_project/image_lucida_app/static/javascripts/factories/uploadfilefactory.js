"use strict";
angular.module('ImageLucidaApp').factory("UploadFileFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getUntransformedFiles: () => {
            return $http.get(`${rootUrl}/get_untransformed_files/`)
            .then( (res)=>{
                return res.data;
            });
        },
        getSingleUploadedFile: (project_id) => {
            return $http.get(`${rootUrl}/get_single_project/${project_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        uploadFile: (file, width, height) =>{
            let fd = new FormData();
            console.log(file);
            fd.append('upload_file', file);
            fd.append('upload_file_name', file.name);
            fd.append('upload_file_height', height);
            fd.append('upload_file_width', width);
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
        deleteUploadFile: (untransformed_file_id) => {
            console.log(untransformed_file_id);
            return $http({
                url:`${rootUrl}/delete_uploaded_file/`,
                method: 'DELETE',
                data: {
                    'untransformed_file_id':untransformed_file_id
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
        duplicateUploadFile: (untransformed_file_id) => {
            return $http({
                url:`${rootUrl}/duplicate_untransformed_file/`,
                method: 'POST',
                data: {
                    'untransformed_file_id':untransformed_file_id
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
"use strict";
angular.module('ImageLucidaApp').factory("TransformFileFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getTransformedFiles: () => {
            return $http.get(`${rootUrl}/get_transform_files/`)
            .then( (res)=>{
                return res.data;
            });
        },
        getSingleTransformFile: (transform_file_id) => {
            return $http.get(`${rootUrl}/get_single_transform_file/${transform_file_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        setTransformation: (upload_file_name, four_points) =>{
            return $http({
                url:`${rootUrl}/transform_upload_file/`,
                method: 'POST',
                data: {
                    'upload_file_name': upload_file_name,
                    'four_points':four_points
                }
            }).then((res)=>{
                console.log(JSON.parse(res));
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        assignTransformFile: (transform_file_name, project_id, folder_id)=>{
            return $http({
                url:`${rootUrl}/assign_transform_file/`,
                method: 'POST',
                data: {
                    'transform_file_name': transform_file_name,
                    'project_id':project_id,
                    'folder_id':folder_id
                }
            }).then((res)=>{
                console.log(JSON.parse(res));
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        addArchivalSource: (transform_file_name, archival_source_id)=>{
            return $http({
                url:`${rootUrl}/add_archival_source/`,
                method: 'POST',
                data: {
                    'transform_file_name': transform_file_name,
                    'archival_source_id':archival_source_id
                }
            }).then((res)=>{
                console.log(JSON.parse(res));
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
        },
        updateTransformFile: (transformed_file_id, transform_file_name) =>{
            return $http({
                url:`${rootUrl}/update_transform_file/`,
                method: 'POST',
                data: {
                    'transform_file_name':transform_file_name,
                    'transformed_file_id':transformed_file_id
                }
            }).then((res)=>{
                return res.data;
            });
        },
        deleteTransformFile: (transformed_file_id) => {
            return $http({
                url:`${rootUrl}/delete_transform_file/`,
                method: 'DELETE',
                data: {
                    'transformed_file_id':transformed_file_id
                }
            }).then( (res)=>{
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
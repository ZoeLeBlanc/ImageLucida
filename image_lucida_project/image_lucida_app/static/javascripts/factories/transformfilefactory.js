"use strict";
angular.module('ImageLucidaApp').factory("TransformFileFactory", ($http)=>{
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
        setTransformation: (upload_file_name, four_points, project_id) =>{
            return $http({
                url:`${rootUrl}/transform_upload_file/`,
                method: 'POST',
                data: {
                    'upload_file_name': upload_file_name,
                    'four_points':four_points,
                    'project_id':project_id
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
        }
    };
});
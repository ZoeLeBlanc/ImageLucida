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
            // let fd = new FormData();
            // console.log(fd);
            // fd.append('upload_file_name', upload_file);
            // fd.append('project_id', project_id);
            // fd.append('four_points', four_points);
            // console.log(fd);
            return $http({
                url:`${rootUrl}/transform_upload_file/`,
                method: 'POST',
                data: {
                    'upload_file_name': upload_file_name,
                    'four_points':four_points,
                    'project_id':project_id
                }
            }).then((res)=>{
                console.log(res);
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        }
    };
});
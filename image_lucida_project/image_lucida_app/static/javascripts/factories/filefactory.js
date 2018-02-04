"use strict";
angular.module('ImageLucidaApp').factory("FileFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getUnassignedFiles: () => {
            return $http.get(`${rootUrl}/get_unassigned_files/`)
            .then( (res)=>{
                return res.data;
            });
        },
        getSourceFiles: (source_id) => {
            return $http.get(`${rootUrl}/get_source_files/${source_id}`)
            .then( (res)=>{
                return res.data;
            });
        },
        getGroupFiles: (group_id) => {
            return $http.get(`${rootUrl}/get_group_files/${group_id}`)
            .then( (res)=>{
                return res.data;
            });
        },
        getSingleFile: (file_id) => {
            console.log(file_id);
            return $http.get(`${rootUrl}/get_single_file/${file_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        createFile: (project_id, folder_id, bucket_id, source_id, group_id, upload_file_id, multi_coords, height, width, date_published, page_number) =>{
            return $http({
                url:`${rootUrl}/create_file/`,
                method: 'POST',
                data: {
                    'project_id':project_id,
                    'folder_id':folder_id,
                    'bucket_id':bucket_id,
                    'source_id':source_id,
                    'group_id':group_id,
                    'upload_file_id': upload_file_id,
                    'multi_coords':multi_coords,
                    'height':height,
                    'width':width,
                    'date_published': date_published,
                    'page_number': page_number,
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        duplicateFile: (project_id, folder_id, bucket_id, source_id, group_id, file_id, date_published, page_number) =>{
            return $http({
                url:`${rootUrl}/duplicate_file/`,
                method: 'POST',
                data: {
                    'project_id':project_id,
                    'folder_id':folder_id,
                    'bucket_id':bucket_id,
                    'source_id':source_id,
                    'group_id':group_id,
                    'file_id': file_id,
                    'date_published': date_published,
                    'page_number': page_number,
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        updateFile: (file_id, file_name) =>{
            return $http({
                url:`${rootUrl}/update_file/`,
                method: 'POST',
                data: {
                    'file_name':file_name,
                    'file_id':file_id
                }
            }).then((res)=>{
                return res.data;
            });
        },
        untransformFile: (file_id) =>{
            return $http({
                url:`${rootUrl}/untransform_file/`,
                method: 'POST',
                data: {
                    'file_id':file_id
                }
            }).then((res)=>{
                return res.data;
            });
        },
        deleteFile: (file_id) => {
            return $http({
                url:`${rootUrl}/delete_file/`,
                method: 'DELETE',
                data: {
                    'file_id':file_id
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
        tagFile: (file_id, tag_name)=>{
            return $http({
                url:`${rootUrl}/tag_file/`,
                method: 'POST',
                data: {
                    'file_id': file_id,
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
        removeTag: (file_id, tag_name)=>{
            return $http({
                url:`${rootUrl}/remove_tag_file/`,
                method: 'DELETE',
                data: {
                    'file_id': file_id,
                    'tag_name':tag_name
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        }
    };
});

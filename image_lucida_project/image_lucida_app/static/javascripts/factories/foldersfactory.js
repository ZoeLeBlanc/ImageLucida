"use strict";
angular.module('ImageLucidaApp').factory("FoldersFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getFolders: () => {
            return $http.get(`${rootUrl}/get_folders/`)
            .then( (res)=>{
                return res.data;
            });
        },
        getSingleFolder: (folder_id) => {
            return $http.get(`${rootUrl}/get_single_folder/${folder_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        newFolder: (folderData) =>{
            return $http({
                url:`${rootUrl}/create_folder/`,
                method: 'POST',
                data: {
                    'title':folderData.title,
                    'description':folderData.description,
                    'tags':folderData.tags,
                    'project_id':folderData.project
                }
            }).then((res)=>{
                return res.data;
            });
        },
        updateFolder: (folderData) =>{
            return $http({
                url:`${rootUrl}/update_folder/`,
                method: 'POST',
                data: {
                    'title':folderData.title,
                    'description':folderData.description,
                    'tags':folderData.tags,
                    'project':folderData.project
                }
            }).then((res)=>{
                return res.data;
            });
        },
        tagFolder: (folder_id, tag_name) =>{
            return $http({
                url:`${rootUrl}/tag_folder/`,
                method: 'POST',
                data: {
                    'folder_id':folder_id,
                    'tag_name':tag_name
                }
            }).then((res)=>{
                return res.data;
            });
        },
        deleteFolder: (folder_id) => {
            return $http({
                url:`${rootUrl}/delete_folder/`,
                method: 'DELETE',
                data: {
                    'folder_id':folder_id
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
        duplicateFolder: (folder_id) => {
            return $http.get(`${rootUrl}/duplicate_folder/${folder_id}`)
            .then( (res)=>{
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
"use strict";
angular.module('ImageLucidaApp').factory("FoldersFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getFolders: (project_id) => {
            return $http.get(`${rootUrl}/get_folders/${project_id}/`)
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
        cuFolder: (folderData) =>{
            console.log(folderData);
            return $http({
                url:`${rootUrl}/cu_folder/`,
                method: 'POST',
                data: {
                    'title':folderData.title,
                    'description':folderData.description,
                    'project_id':folderData.project_id
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
    };
});

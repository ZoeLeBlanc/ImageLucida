"use strict";
angular.module('ImageLucidaApp').factory("ArchivalSourceFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getArchivalSources: () => {
            return $http.get(`${rootUrl}/get_archival_sources/`)
            .then( (res)=>{
                return res.data;
            });
        },
        newArchivalSource: (archivalSourceData) =>{
            return $http({
                url:`${rootUrl}/create_archival_source/`,
                method: 'POST',
                data: {
                    'archive_name':archivalSourceData.archive_name,
                    'collection_name':archivalSourceData.collection_name,
                    'folder_name':archivalSourceData.folder_name
                }
            }).then((res)=>{
                return res.data;
            });
        },
        updateProject: (userData) =>{
            return $http({
                url:`${rootUrl}/login/`,
                method: 'POST',
                data: {
                    'username': userData.username,
                    'password': userData.password,
                }
            }).then((res)=>{
                return res.data;
            });
        },
        deleteProject: (projectId) => {
            return $http.delete(`${rootUrl}/projects/${projectId}`)
            .then( (res)=>{
                return res.data;
            });
        } 
    };
});
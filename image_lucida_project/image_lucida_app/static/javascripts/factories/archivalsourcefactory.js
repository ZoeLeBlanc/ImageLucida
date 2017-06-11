"use strict";
angular.module('ImageLucidaApp').factory("ArchivalSourceFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getAllArchivalSources: () => {
            return $http.get(`${rootUrl}/get_all_archival_sources/`)
            .then( (res)=>{
                return res.data;
            });
        },
        getFileArchivalSources: (transform_file_id) =>{
            return $http.get(`${rootUrl}/get_file_archival_sources/${transform_file_id}/`)
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
        updateArchivalSource: (archivalSourceData) =>{
            return $http({
                url:`${rootUrl}/update_archival_source/`,
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
        deleteArchivalSource: (archival_source_id) => {
            return $http({
                url:`${rootUrl}/delete_archival_source/`,
                method: 'DELETE',
                data: {
                    'archival_source_id':archival_source_id
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
"use strict";
angular.module('ImageLucidaApp').factory("SourceFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getSources: (bucket_id) => {
            return $http.get(`${rootUrl}/get_sources/${bucket_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        getSingleSource: (source_id) => {
            return $http.get(`${rootUrl}/get_single_source/${source_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        cuSource: (sourceData) =>{
            return $http({
                url:`${rootUrl}/cu_source/`,
                method: 'POST',
                data: {
                    'source_name':sourceData.source_name,
                    'publication_location':sourceData.publication_location,
                    'bucket_id':sourceData.bucket_id
                }
            }).then((res)=>{
                return res.data;
            });
        },
        updateSource: (sourceData) =>{
            return $http({
                url:`${rootUrl}/update_source/`,
                method: 'POST',
                data: {
                    'archive_name':sourceData.archive_name,
                    'collection_name':sourceData.collection_name,
                    'folder_name':sourceData.folder_name
                }
            }).then((res)=>{
                return res.data;
            });
        },
        deleteSource: (source_id) => {
            return $http({
                url:`${rootUrl}/delete_source/`,
                method: 'DELETE',
                data: {
                    'source_id':source_id
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

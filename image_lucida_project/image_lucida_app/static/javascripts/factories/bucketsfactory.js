"use strict";
angular.module('ImageLucidaApp').factory("BucketsFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getBuckets: (folder_id) => {
            return $http.get(`${rootUrl}/get_buckets/${folder_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        getSingleBucket: (bucket_id) => {
            return $http.get(`${rootUrl}/get_single_bucket/${bucket_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        cuBucket: (bucketData) =>{
            return $http({
                url:`${rootUrl}/cu_bucket/`,
                method: 'POST',
                data: {
                    'bucket_name':bucketData.bucket_name,
                    'bucket_type':bucketData.bucket_type,
                    'folder_id':bucketData.folder_id
                }
            }).then((res)=>{
                return res.data;
            });
        },
        deleteBucket: (bucket_id) => {
            return $http({
                url:`${rootUrl}/delete_bucket/`,
                method: 'DELETE',
                data: {
                    'bucket_id':bucket_id
                }
            }).then( (res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
    };
});

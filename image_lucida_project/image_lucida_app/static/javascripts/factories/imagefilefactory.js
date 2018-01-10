"use strict";
angular.module('ImageLucidaApp').factory("ImageFileFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        deleteImageFile: (image_file_id) => {
            return $http({
                url:`${rootUrl}/delete_image_file/`,
                method: 'DELETE',
                data: {
                    'image_file_id':image_file_id
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
        tagImageFile: (image_file_id, tag_name)=>{
            return $http({
                url:`${rootUrl}/tag_images/`,
                method: 'POST',
                data: {
                    'image_file_id': image_file_id,
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
        manualSegmentation: (file_id, multi_coords, ocr, process_type, height, width)=>{
            console.log(process_type);
            return $http({
                url:`${rootUrl}/manual_segmentation/`,
                method: 'POST',
                data: {
                    'file_id': file_id,
                    'multi_coords':multi_coords,
                    'ocr':ocr,
                    'process_type':process_type,
                    'height':height,
                    'width':width
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        autoImageSegmentation: (file_id)=>{
            return $http({
                url:`${rootUrl}/auto_segment_image_file/`,
                method: 'POST',
                data: {
                    'file_id': file_id
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        getSingleImageFile: (image_file_id) => {
            return $http.get(`${rootUrl}/get_single_image_file/${image_file_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
    };
});
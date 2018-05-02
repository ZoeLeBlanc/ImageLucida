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
        manualSegmentation: (file_id, multi_coords, ocr, process_type, height, width, index, translate)=>{
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
                    'width':width,
                    'index': index,
                    'translate': translate
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
        getContours: (file_id, dilation) => {
            return $http({
                url: `${rootUrl}/get_contours/`,
                method: 'POST',
                data: {
                    'file_id': file_id,
                    'dilation': dilation
                }
            }).then((res) => {
                return res.data;
            }, (res) => {
                if (res.status > 0) {
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
        processImageText: (image_file_id, process_type) =>{
            return $http({
                url:`${rootUrl}/image_process_text/`,
                method: 'POST',
                data: {
                    'image_file_id': image_file_id,
                    'process_type':process_type
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
        orderImage: (image_file_id, image_order) =>{
            return $http({
                url:`${rootUrl}/order_image/`,
                method: 'POST',
                data: {
                    'image_file_id': image_file_id,
                    'image_order':image_order
                }
            }).then((res)=>{
                return res.data;
            }, (res)=>{
                if(res.status > 0){
                    return res.status;
                }
            });
        },
    };
});

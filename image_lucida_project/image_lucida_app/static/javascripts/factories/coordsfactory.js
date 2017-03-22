"use strict";
// angular.module('ImageLucidaApp').factory("CoordsFactory", ()=>{
//     return {
//         setCoords: (event) => {
//             return $http.get(`${rootUrl}/get_untransformed_files/`)
//             .then( (res)=>{
//                 return res.data;
//             });
//         },
//         getSingleUploadedFile: (project_id) => {
//             return $http.get(`${rootUrl}/get_single_project/${project_id}/`)
//             .then( (res)=>{
//                 return res.data;
//             });
//         },
//         uploadFile: (file, project_id) =>{
//             let fd = new FormData();
//             console.log(fd);
//             fd.append('upload_file', file);
            
//             fd.append('upload_file_name', file.name);
//             fd.append('project_id', project_id);
//             fd.append('upload_file_height', file.height);
//             fd.append('upload_file_width', file.width);
//             console.log(fd);
//             return $http({
//                 url:`${rootUrl}/upload_file/`,
//                 method: 'POST',
//                 data: fd,
//                 headers: { 
//                     'Content-Type': undefined
//                 },
//                 transformRequest: angular.identity
//             }).then((res)=>{
//                 console.log(res);
//                 return res.data;
//             }, (res)=>{
//                 if(res.status > 0){
//                     return res.status;
//                 }
//             });
//         },
//         getUploadedFile: (userData) =>{
//             return $http({
//                 url:`${rootUrl}/login/`,
//                 method: 'POST',
//                 data: {
//                     'username': userData.username,
//                     'password': userData.password,
//                 }
//             }).then((res)=>{
//                 return res.data;
//             });
//         },
//         deleteProject: (projectId) => {
//             return $http.delete(`${rootUrl}/projects/${projectId}`)
//             .then( (res)=>{
//                 return res.data;
//             });
//         } 
//     };
// });
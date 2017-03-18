"use strict";
angular.module('ImageLucidaApp').factory("ProjectsFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getProjects: () => {
            return $http.get(`${rootUrl}/get_projects/`)
            .then( (res)=>{
                return res.data;
            });
        },
        getSingleProject: (project_id) => {
            return $http.get(`${rootUrl}/get_single_project/${project_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        newProject: (projectData) =>{
            return $http({
                url:`${rootUrl}/create_project/`,
                method: 'POST',
                data: {
                    'title':projectData.title,
                    'description':projectData.description,
                    'tags':projectData.tags,
                    'status':projectData.status,
                    'private':projectData.private
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
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
        cuProject: (projectData) =>{
            return $http({
                url:`${rootUrl}/cu_project/`,
                method: 'POST',
                data: {
                    'title':projectData.title,
                    'description':projectData.description,
                }
            }).then((res)=>{
                return res.data;
            });
        },
        deleteProject: (project_id) => {
            return $http.delete(`${rootUrl}/delete_project/${project_id}`)
            .then( (res)=>{
                return res.data;
            });
        },
    };
});

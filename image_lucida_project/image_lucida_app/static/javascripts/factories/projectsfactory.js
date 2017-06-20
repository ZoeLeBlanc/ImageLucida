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
        updateProject: (projectData) =>{
            return $http({
                url:`${rootUrl}/update_project/`,
                method: 'POST',
                data: {
                    'title':projectData.title,
                    'description':projectData.description,
                    'tags':projectData.tags,
                    'status':projectData.status,
                    'private':projectData.private,
                    'project_id':projectData.id
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
        duplicateProject: (project_id) => {
            return $http.get(`${rootUrl}/duplicate_project/${project_id}`)
            .then( (res)=>{
                return res.data;
            });
        },
        tagProject: (project_id, tag_name)=>{
            return $http({
                url:`${rootUrl}/tag_project/`,
                method: 'POST',
                data: {
                    'project_id': project_id,
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
    };
});
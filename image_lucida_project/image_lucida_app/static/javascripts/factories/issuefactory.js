"use strict";
angular.module('ImageLucidaApp').factory("IssueFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getIssues: () => {
            return $http.get(`${rootUrl}/get_issues/`)
            .then( (res)=>{
                return res.data;
            });
        },
        newIssue: (issueData) =>{
            return $http({
                url:`${rootUrl}/create_issue/`,
                method: 'POST',
                data: {
                    'issue_name':issueData.issue_name,
                    'date_published':issueData.date_published,
                    'publication_location':issueData.publication_location,
                    'issue_number':issueData.issue_number
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
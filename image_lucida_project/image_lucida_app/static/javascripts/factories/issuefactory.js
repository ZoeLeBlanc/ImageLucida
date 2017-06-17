"use strict";
angular.module('ImageLucidaApp').factory("IssueFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getAllIssues: () => {
            return $http.get(`${rootUrl}/get_all_issues/`)
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
        updateArchivalSource: (issueData) =>{
            return $http({
                url:`${rootUrl}/update_issue/`,
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
        deleteArchivalSource: (issue_id) => {
            return $http({
                url:`${rootUrl}/delete_issue/`,
                method: 'DELETE',
                data: {
                    'issue_id':issue_id
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
"use strict";
angular.module('ImageLucidaApp').factory("GroupFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getGroups: (source_id) => {
            return $http.get(`${rootUrl}/get_groups/${source_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        getSingleGroup: (group_id) => {
            return $http.get(`${rootUrl}/get_single_group/${group_id}/`)
            .then( (res)=>{
                return res.data;
            });
        },
        createGroup: (groupData) =>{
            return $http({
                url:`${rootUrl}/create_group/`,
                method: 'POST',
                data: {
                    'group_name':groupData.group_name,
                    'date_published':groupData.date_published,
                    'source_id':groupData.source_id,
                }
            }).then((res)=>{
                return res.data;
            });
        },
        updateGroup: (groupData) =>{
            return $http({
                url:`${rootUrl}/update_group/`,
                method: 'POST',
                data: {
                    'group_name':groupData.group_name,
                    'date_published':groupData.date_published,
                    'group_id':groupData.group_id,
                    'source_id':groupData.source_id
                }
            }).then((res)=>{
                return res.data;
            });
        },
        deleteGroup: (group_id) => {
            return $http({
                url:`${rootUrl}/delete_group/`,
                method: 'DELETE',
                data: {
                    'group_id':group_id
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

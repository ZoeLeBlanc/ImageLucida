"use strict";
angular.module('ImageLucidaApp').factory("StatusFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        getStatuses: () => {
            return $http.get(`${rootUrl}/get_statuses/`)
            .then( (res)=>{
                return res.data;
            });
        }
    };
});
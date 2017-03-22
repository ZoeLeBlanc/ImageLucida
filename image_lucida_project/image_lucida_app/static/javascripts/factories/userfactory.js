"use strict";
myApp.factory("UserFactory", ($http)=>{
    const rootUrl = 'http://localhost:8000';
    return {
        authUser: () => {
            return $http.get(`${rootUrl}/auth_user/`)
            .then( (res)=>{
                return res.data.user;
            });
        },
        registerUser: (userData) =>{
            return $http({
                url:`${rootUrl}/register_user/`,
                method: 'POST',
                data: {
                    'username': userData.username,
                    'email': userData.email,
                    'password': userData.password,
                    'first_name':userData.first_name,
                    'last_name':userData.last_name,
                }
            }).then((res)=>{
                return res.data;
            });
        },
        loginUser: (userData) =>{
            return $http({
                url:`${rootUrl}/login_user/`,
                method: 'POST',
                data: {
                    'username': userData.username,
                    'password': userData.password,
                }
            }).then((res)=>{
                return res.data;
            });
        },
        logoutUser: () => {
            return $http.get(`${rootUrl}/logout_user/`)
            .then( (res)=>{
                return res.data;
            });
        } 
    };
});
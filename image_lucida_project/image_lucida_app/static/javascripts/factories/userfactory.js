"use strict";
myApp.factory("UserFactory", ($q, $http)=>{
    const rootUrl = 'http://localhost:8000';
    console.log($http.defaults);
    return {
        authUser: () => {
            return $http.get(`${rootUrl}/auth_user/`, {withCredentials:true})
            .then( (res)=>{
                return res.data.username;
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
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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

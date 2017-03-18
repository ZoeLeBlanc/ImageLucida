"use strict";
let user_auth = (UserFactory)=>{
    new Promise( (resolve, reject)=>{
        if (UserFactory.authUser()){
            resolve();
        } else {
            reject();
        }
    });
};
angular.module('ImageLucidaApp').config([
    '$interpolateProvider',
    '$httpProvider',
    '$routeProvider',
    ($interpolateProvider, $httpProvider, $routeProvider)=>{
        $interpolateProvider.startSymbol('((');
        $interpolateProvider.endSymbol('))');

        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

        $routeProvider
            .when('/', {
              controller: 'HomeCtrl',
              templateUrl: '/static/partials/landing-page.html'
            })
            .when('/register', {
                controller: 'AuthCtrl',
                templateUrl: '/static/partials/register.html'
            })
            .when('/login', {
                controller: 'AuthCtrl',
                templateUrl: '/static/partials/login.html'
            })
            .when('/logout', {
                controller: 'AuthCtrl',
                templateUrl: '/static/partials/landing-page.html'
            })
            .when('/projects', {
                controller: 'ProjectsCtrl',
                templateUrl: '/static/partials/projects.html',
                resolve: {user_auth}
            })
            .when('/projects/new', {
                controller: 'NewProjectCtrl',
                templateUrl: '/static/partials/new-project.html',
                resolve: {user_auth}
            })
            .when('/projects/edit:id', {
                controller: 'EditProjectCtrl',
                templateUrl: '/static/partials/new-project.html',
                resolve: {user_auth}
            })
            .when('/projects/view/:id', {
                controller: 'ViewProjectCtrl',
                templateUrl: '/static/partials/view-project.html',
                resolve: {user_auth}
            })
            .otherwise('/');
    }
]);
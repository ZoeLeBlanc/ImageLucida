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
            .when('/projects/edit/:id', {
                controller: 'NewProjectCtrl',
                templateUrl: '/static/partials/new-project.html',
                resolve: {user_auth}
            })
            .when('/projects/view/:id', {
                controller: 'ViewProjectCtrl',
                templateUrl: '/static/partials/view-project.html',
                resolve: {user_auth}
            })
            .when('/projects/upload/', {
                controller: 'UploadFileCtrl',
                templateUrl: '/static/partials/upload-file.html',
                resolve: {user_auth}
            })
            .when('/projects/transform/', {
                controller: 'TransformFileCtrl',
                templateUrl: '/static/partials/transform-file.html',
                resolve: {user_auth}
            })
            .when('/projects/:id/new-folder', {
                controller: 'NewFolderCtrl',
                templateUrl: '/static/partials/new-folder.html',
                resolve: {user_auth}
            })
            .when('/projects/:id/edit-folder/:folder_id', {
                controller: 'NewFolderCtrl',
                templateUrl: '/static/partials/new-folder.html',
                resolve: {user_auth}
            })
            .when('/projects/:id/view-folder/:folder_id', {
                controller: 'ViewFolderCtrl',
                templateUrl: '/static/partials/view-folder.html',
                resolve: {user_auth}
            })
            .when('/projects/process-text/:active_id', {
                controller: 'ProcessTextCtrl',
                templateUrl: '/static/partials/process-text.html',
                resolve: {user_auth}
            })
            .when('/projects/process-image/:active_id', {
                controller: 'ProcessImageCtrl',
                templateUrl: '/static/partials/process-image.html',
                resolve: {user_auth}
            })
            .when('/projects/manual-segment/:active_id', {
                controller: 'ManualSegmentImageCtrl',
                templateUrl: '/static/partials/manual-segment-image.html',
                resolve: {user_auth}
            })
            .when('/projects/view-annotations/:active_id', {
                controller: 'ViewAnnotationsCtrl',
                templateUrl: '/static/partials/view-annotations.html',
                resolve: {user_auth}
            })
            .when('/projects/meta-data/:active_id', {
                controller: 'MetaDataCtrl',
                templateUrl: '/static/partials/meta-data.html',
                resolve: {user_auth}
            })
            .when('/projects/unassign-image/:active_id', {
                controller: 'UnassignCtrl',
                templateUrl: '/static/partials/unassign.html',
                resolve: {user_auth}
            })
            .when('/explore/', {
                controller: 'ExploreCtrl',
                templateUrl: '/static/partials/explore.html',
                resolve: {user_auth}
            })
            .otherwise('/');
    }
]);
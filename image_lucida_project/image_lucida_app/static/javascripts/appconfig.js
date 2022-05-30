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

        // $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        // $httpProvider.defaults.headers.common["X-CSRFToken"] = window.csrf_token;
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
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
            .when('/home', {
                controller: 'HomeCtrl',
                templateUrl: '/static/partials/home.html',
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
            .when('/projects/upload/', {
                controller: 'UploadFileCtrl',
                templateUrl: '/static/partials/upload-file.html',
                resolve: {user_auth}
            })
            .when('/projects/transform/', {
                controller: 'NewFileCtrl',
                templateUrl: '/static/partials/new-file.html',
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
            .when('/new-bucket', {
                controller: 'NewBucketCtrl',
                templateUrl: '/static/partials/new-bucket.html',
                resolve: {user_auth}
            })
            .when('/edit-bucket/:bucket_id', {
                controller: 'NewBucketCtrl',
                templateUrl: '/static/partials/new-bucket.html',
                resolve: {user_auth}
            })
            .when('/new-source', {
                controller: 'NewSourceCtrl',
                templateUrl: '/static/partials/new-source.html',
                resolve: {user_auth}
            })
            .when('/edit-source/:source_id', {
                controller: 'NewSourceCtrl',
                templateUrl: '/static/partials/new-source.html',
                resolve: {user_auth}
            })
            .when('/projects/view-texts/', {
                controller: 'ViewTextsCtrl',
                templateUrl: '/static/partials/view-texts.html',
                resolve: {user_auth}
            })
            .when('/projects/view-images/', {
                controller: 'ViewImagesCtrl',
                templateUrl: '/static/partials/view-images.html',
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
            .when('/duplicate/', {
                controller: 'DuplicateCtrl',
                templateUrl: '/static/partials/duplicate.html',
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

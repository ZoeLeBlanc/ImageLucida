var app = angular.module("ImageLucidaApp", ["ngRoute", 'ui.materialize', 'xeditable', 'ng-file-model', 'ngSanitize', 'ngCsv', 'angular.filter']);

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
        .when('/auth', {
          controller: 'MainController',
          templateUrl: '/static/auth.html'
        })
        .when('/hello', {
          controller: 'HelloController',
          templateUrl: '/static/hello.html'
        });
    }
]);
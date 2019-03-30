const Parse = require('parse');
const angular = require('angular')
require('angular-route')

Parse.initialize(process.env.APP_ID);
Parse.serverURL = '/parse';

angular.module('app', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                template: require('./templates/landmarks-list.html'),
                controller: 'LandmarksController',
                controllerAs: 'landmarksList'
            })
            .when('/login', {
                template: require('./templates/login.html'),
                controller: 'LoginController',
                controllerAs: 'ctrl',
                redirectTo: function () {
                    if (Parse.User.current()) {
                        return '/admin'
                    }
                }
            })
            .when('/admin', {
                template: require('./templates/admin.html'),
                controller: 'AdminController',
                controllerAs: 'ctrl',
                redirectTo: function () {
                    if (!Parse.User.current()) {
                        return '/login'
                    }
                }
            })
            .when('/:landmarkID', {
                template: require('./templates/landmark-single.html'),
                controller: 'SingleLandmarkController',
                controllerAs: 'ctrl'

            });
        $locationProvider.html5Mode(true);
    })
    .directive("selectImgFiles", function () {
        return {
            scope: {
                change: '=',
                selectImgFiles: '='
            },
            link: function postLink(scope, elem, attrs, ngModel) {
                elem.on("change", function (ev) {
                    var files = elem[0].files;
                    if (files && files.length > 0) {
                        var file = files[0];
                        scope.$apply(function () {
                            scope.change(file, scope.selectImgFiles)
                        })
                    }
                })
            }
        }
    });

require('./controllers/AdminController')
require('./controllers/LandmarksController')
require('./controllers/LoginController')
require('./controllers/SingleLandmarkController')
require('./controllers/NavController')
const Parse = require('parse');
Parse.initialize('dkdkdkd')

Parse.serverURL = 'http://localhost:1337/parse'

var Landmark = Parse.Object.extend("dubai_landmarks");

// new Parse.Query(Landmark).find().then(list => {
//     list.forEach(l => console.log(l.get('description')))
// })


const angular = require('angular')
require('angular-route')

angular.module('app', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                template: require('./landmarks-list.html'),
                controller: 'LandmarksController',
                controllerAs: 'landmarksList'
            })
            .when('/login', {
                template: require('./login.html'),
                controller: 'LoginController',
                controllerAs: 'ctrl',
                redirectTo: function () {
                    if (Parse.User.current()) {
                        console.log('current user!')
                        return '/admin'
                    } else {
                        console.log('no current user')
                    }
                }
            })
            .when('/admin', {
                template: require('./admin.html'),
                controller: 'AdminController',
                controllerAs: 'ctrl',
                redirectTo: function () {
                    if (!Parse.User.current()) {
                        console.log('no current user')
                        return '/login'
                    } else {
                        console.log('current user!')
                    }
                }
            })
            .when('/:landmarkID', {
                template: require('./landmark-single.html'),
                controller: 'SingleLandmarkController',
                controllerAs: 'ctrl'

            });
        $locationProvider.html5Mode(true);
    })
    .controller('LandmarksController', function ($scope, $q) {
        var landmarksList = this;
        console.log($q)

        $q(function (resolve, reject) {
            new Parse.Query(Landmark).find().then(list => {

                console.log(list.map(l => l.toJSON()))

                resolve(list.map(l => l.toJSON()))
                // list.forEach(l => console.log(l.get('description')))
            })
        }).then(l => {
            landmarksList.landmarks = l;
        })
    })
    .controller('SingleLandmarkController', function ($q, $routeParams) {
        var ctrl = this;
        console.log($routeParams.landmarkID)

        $q(function (resolve, reject) {
            new Parse.Query(Landmark).get($routeParams.landmarkID)
                .then(landmark => {

                    resolve(landmark.toJSON())
                    // list.forEach(l => console.log(l.get('description')))
                })
        }).then(l => {
            console.log(l)
            ctrl.landmark = l;
        })
    })
    .controller('LoginController', function ($q, $location) {
        var ctrl = this;
        ctrl.username = '';
        ctrl.password = '';

        ctrl.submit = () => {
            if (ctrl.username && ctrl.password) {
                $q(function (resolve, reject) {
                    Parse.User.logIn(ctrl.username, ctrl.password)
                        .then(resolve)
                        .catch(reject)
                }).then(user => {
                    $location.url('/admin')
                    // console.log(user)
                }).catch(err => {
                    ctrl.error = err.message;
                })


            }
        }
    })
    .controller('AdminController', function ($q, $timeout) {
        var ctrl = this;
        var currentUser = Parse.User.current();
        var landmarks;

        var alerts = {};
        ctrl.alerts = alerts;

        ctrl.onImage = function (file, landmark) {
            if (file.size * 10 ** -6 > 5) {
                ctrl.alerts[landmark.objectId] = {
                    sucess: false,
                    message: "File too big! Maximum size is 5MB."
                }
                return $timeout(() => alerts[landmark.objectId] = null, 3000)
            }

            var toUpdate = landmarks.find(l => l.id === landmark.objectId);

            var parseFile = new Parse.File(file.name, file);
            toUpdate.set('photo', parseFile)

            $q(function (resolve, reject) {
                toUpdate.save()
                    .then(resolve)
                    .catch(reject)
            }).then((data) => {
                
                landmark.photo = data.get('photo').toJSON()
                
                alerts[landmark.objectId] = {
                    success: true,
                    message: 'Saved successfully'
                }
                $timeout(() => alerts[landmark.objectId] = null, 2000)
            }, (error) => {
                alerts[landmark.objectId] = {
                    sucess: false,
                    message: error.message
                }
                $timeout(() => alerts[landmark.objectId] = null, 2000)
            });
        }

        ctrl.save = function (landmark) {

            console.log('saving', landmark, landmarks.find(l => l.id === landmark.objectId))

            var toUpdate = landmarks.find(l => l.id === landmark.objectId);

            toUpdate.set('title', landmark.title)
            toUpdate.set('short_info', landmark.short_info)
            toUpdate.set('description', landmark.description)
            toUpdate.set('url', landmark.url)

            $q(function (resolve, reject) {
                toUpdate.save()
                    .then(resolve)
                    .catch(reject)
            })
                .then(() => {
                    alerts[landmark.objectId] = {
                        success: true,
                        message: 'Saved successfully'
                    }
                    $timeout(() => alerts[landmark.objectId] = null, 2000)
                }, (error) => {
                    alerts[landmark.objectId] = {
                        sucess: false,
                        message: error.message
                    }
                    $timeout(() => alerts[landmark.objectId] = null, 2000)
                });

        }
        $q(function (resolve, reject) {
            new Parse.Query(Landmark).find().then(list => {

                landmarks = list;
                console.log(list.map(l => l.toJSON()))

                resolve(list.map(l => l.toJSON()))
                // list.forEach(l => console.log(l.get('description')))
            })
        }).then(l => {
            ctrl.landmarks = l;
        })
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
    })
// data.forEach(d => {
//     const landmark = new Landmark();

//     landmark.set("order", d.order);
//     landmark.set("url", d.url);
//     landmark.set("description", d.description);
//     landmark.set("short_info", d.short_info);
//     landmark.set("title", d.title);
//     landmark.set("location", new Parse.GeoPoint(d.location));

//     landmark.save()
//         .then((l) => {
//             // Execute any logic that should take place after the object is saved.
//             console.log('New object created with objectId: ' + l.id);
//         }, (error) => {
//             // Execute any logic that should take place if the save fails.
//             // error is a Parse.Error with an error code and message.
//             console.error('Failed to create new object, with error code: ' + error.message);
//         });
// })

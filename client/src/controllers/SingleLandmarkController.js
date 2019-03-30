const Parse = require('parse');
var Landmark = Parse.Object.extend("dubai_landmarks");

angular.module('app')
    .controller('SingleLandmarkController', function ($q, $routeParams, $scope) {
        var ctrl = this;
        $q((resolve, reject) => {
            new Parse.Query(Landmark).get($routeParams.landmarkID)
                .then(landmark => resolve(landmark.toJSON()))
                .catch(reject)
        }).then(landmark => {
            ctrl.landmark = landmark

            if (landmark.photo && landmark.photo.url) {
                let img = new Image()
                img.src = landmark.photo.url
                img.onload = () => {
                    $scope.$apply(() => {
                        ctrl.is16_9 = img.width / img.height >= 1;
                    })
                }
            }

        })
        .catch(err => {
            ctrl.error = err.message
        })
    })
const Parse = require('parse');
var Landmark = Parse.Object.extend("dubai_landmarks");

angular.module('app')
    .controller('LandmarksController', function ($q) {
        var landmarksList = this;
        $q((resolve, reject) => {
            new Parse.Query(Landmark).ascending("order").find()
                .then(list => resolve(list.map(l => l.toJSON())))
                .catch(reject)
        }).then(landmarks => landmarksList.landmarks = landmarks)
    })
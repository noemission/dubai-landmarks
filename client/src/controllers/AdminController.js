const Parse = require('parse');
var Landmark = Parse.Object.extend("dubai_landmarks");


angular.module('app')
    .controller('AdminController', function ($q, $timeout) {
        var ctrl = this;
        var landmarks;

        var alerts = {};
        ctrl.alerts = alerts;

        $q(function (resolve, reject) {
            new Parse.Query(Landmark).find()
                .then(list => {
                    landmarks = list;
                    resolve(list.map(l => l.toJSON()))
                })
                .catch(reject)
        }).then(landmarks => ctrl.landmarks = landmarks)

        const showPopup = (success, message, landmarkID, timeout) => {
            ctrl.alerts[landmarkID] = {
                success,
                message,
            }
            return $timeout(() => alerts[landmarkID] = null, timeout || 2000)
        }

        ctrl.onImage = function (file, landmark) {
            if (file.size * 10 ** -6 > 5) {
                return showPopup(false, "File too big! Maximum size is 5MB.", landmark.objectId, 3000)
            }
            var toUpdate = landmarks.find(l => l.id === landmark.objectId);
            var parseFile = new Parse.File(file.name, file);
            toUpdate.set('photo', parseFile)

            $q(function (resolve, reject) {
                toUpdate.save()
                    .then(resolve)
                    .catch(reject)
            })
                .then((data) => {
                    landmark.photo = data.get('photo').toJSON()
                    showPopup(true, 'Saved successfully', landmark.objectId)
                })
                .catch(err => showPopup(false, err.message, landmark.objectId))
        }

        ctrl.save = function (landmark) {
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
                .then(() => showPopup(true, 'Saved successfully', landmark.objectId))
                .catch(err => showPopup(false, err.message, landmark.objectId))
        }
    })
const Parse = require('parse');

angular.module('app')
    .controller('LoginController', function ($q, $location, $rootScope) {
        var ctrl = this;
        ctrl.username = '';
        ctrl.password = '';

        ctrl.submit = () => {
            if (ctrl.username && ctrl.password) {
                $q((resolve, reject) => {
                    Parse.User.logIn(ctrl.username, ctrl.password)
                        .then(resolve)
                        .catch(reject)
                })
                    .then(() => {
                        $rootScope.logged = true;
                        $location.url('/admin')
                    })
                    .catch(err => ctrl.error = err.message)
            }
        }
    })
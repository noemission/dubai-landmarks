const Parse = require('parse');

angular.module('app')
    .controller('NavController', function ($rootScope) {
        if (Parse.User.current()) {
            $rootScope.logged = true;
        }else{
            $rootScope.logged = false;
        }
    })
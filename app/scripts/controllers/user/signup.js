'use strict';

angular
  .module('korbjagdApp')
  .controller('SignupCtrl', function($scope, $state, $window, $filter, User) {
    if ($scope.getCurrentUser()) {
      $state.go('map.app.home');
    }
    $scope.setTitle('Sign Up');

    $scope.user = {
      username: null,
      email: null,
      password: null,
      password_confirmation: null
    };

    $scope.submit = function() {
      $scope.errors = {};

      User.save({user: angular.copy($scope.user)}).$promise
        .then(function(resp) {
          $window.localStorage.username = resp.user.username;
          $state.go('map.app.sign.in');
        })
        .catch(function(resp) {
          var titleize = $filter('titleize');

          angular.forEach(resp.data.details, function(details, attr) {
            $scope.errors[attr] = [titleize(attr), details[0]].join(' ');
          });

          $scope.user.password = null;
          $scope.user.password_confirmation = null;
        });
      };
  });

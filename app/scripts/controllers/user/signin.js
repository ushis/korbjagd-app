'use strict';

angular
  .module('korbjagdApp')
  .controller('SigninCtrl', function($scope, $state, $timeout, $window,
                                     Session, Auth) {

    if ($scope.getCurrentUser()) {
      $state.go('map.app.home');
    }
    $scope.setTitle('Sign In');

    $scope.user = {
      username: $window.localStorage.username,
      password: null
    };

    $scope.submit = function() {
      $scope.error = null;

      Session.save({user: angular.copy($scope.user)}).$promise
        .then(function(resp) {
          $window.localStorage.username = resp.user.username;
          Auth.setToken(resp.user.auth_token);
          $scope.setCurrentUser(resp.user);
          $state.go('map.app.home');
        })
        .catch(function() {
          $scope.error = 'Oh no! That wasn\'t correct. Maybe a typo?';
          $scope.user.password = null;
        });
      };
  });

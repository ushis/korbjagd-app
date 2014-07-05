'use strict';

angular
  .module('korbjagdApp')
  .controller('PasswordForgotCtrl', function($scope, $state, PasswordReset) {
    $scope.submit = function() {
      PasswordReset.save({user: angular.copy($scope.user)}, function(resp) {
        $scope.user.email = resp.user.email;
        $state.go('map.app.password.instructions');
      });
    };
  });

'use strict';

angular
  .module('korbjagdApp')
  .controller('PasswordInstructionsCtrl', function($scope, $state) {
    if (!$scope.user.email) {
      $state.go('map.app.password.forgot');
    }
  });

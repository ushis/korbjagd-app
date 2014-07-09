'use strict';

angular
  .module('korbjagdApp')
  .controller('PasswordCtrl', function($scope, $state) {
    if ($scope.getCurrentUser()) {
      $state.go('map.app.profile');
    }
    $scope.setTitle('Password Reset');
    $scope.user = {email: null};
  });

'use strict';

angular
  .module('korbjagdApp')
  .controller('UserDeleteCtrl', function($scope, $state, Profile) {
    if (!$scope.getCurrentUser()) {
      $state.go('map.app.home');
    }
    $scope.setTitle('Delete Account');

    $scope.delete = function() {
      Profile.delete(function() {
        $scope.signOut();
      });
    };
  });

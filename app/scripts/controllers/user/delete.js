'use strict';

angular
  .module('korbjagdApp')
  .controller('UserDeleteCtrl', function($scope, $state, User) {
    if (!$scope.getCurrentUser()) {
      $state.go('map.app.home');
    }
    $scope.setTitle('Delete Account');

    $scope.delete = function() {
      User.delete({userId: $scope.getCurrentUser().id}, function() {
        $scope.signOut();
      });
    };
  });

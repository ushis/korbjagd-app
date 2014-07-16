'use strict';

angular
  .module('korbjagdApp')
  .controller('UserDeleteCtrl', function($scope, $state, Auth, Profile, DeleteToken) {
    if (!$scope.getCurrentUser()) {
      $state.go('map.app.home');
    }
    $scope.setTitle('Delete Account');
    $scope.user = {password: null};

    $scope.submit = function() {
      DeleteToken.save({user: angular.copy($scope.user)}).$promise
        .then(function(resp) {
          var token = Auth.getToken();
          Auth.setToken(resp.delete_token.token);

          Profile.delete().$promise
            .then(function() {
              $scope.signOut();
            })
            .catch(function() {
              Auth.setToken(token);
            });
        })
        .catch(function() {
          $scope.error = 'Oh no! That wasn\'t correct. Maybe a typo?';
          $scope.user.password = null;
        });
    };
  });

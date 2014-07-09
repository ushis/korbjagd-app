'use strict';

angular
  .module('korbjagdApp')
  .controller('ProfileCtrl', function($scope, $state, $filter, Profile, Avatar) {
    if (!$scope.getCurrentUser()) {
      $state.go('map.app.home');
    }
    $scope.setTitle('Profile');

    $scope.user = angular.extend({
      password: null,
      password_confirmation: null
    }, $scope.getCurrentUser());

    $scope.image = {};

    // Auto update avatar
    $scope.$watch('image', function() {
      if (!$scope.image.url) {
        return;
      }
      $scope.user.avatar = {url: $scope.image.url};
      var data = {avatar: {image: $scope.image.url}};

      Avatar.update(data, function(resp) {
        $scope.currentUser.avatar = resp.avatar;
        $scope.user.avatar = resp.avatar;
      });
    }, true);

    // Save profile changes
    $scope.submit = function() {
      var user = angular.copy($scope.user);

      if (!user.password) {
        delete(user.password);
        delete(user.password_confirmation);
      }

      Profile.update({user: user}).$promise
        .then(function(resp) {
          $scope.setCurrentUser(resp.user);
          $state.go('map.app.home');
        })
        .catch(function(resp) {
          var titleize = $filter('titleize');
          $scope.errors = {};

          angular.forEach(resp.data.details, function(details, attr) {
            $scope.errors[attr] = [titleize(attr), details[0]].join(' ');
          });

          $scope.user.password = null;
          $scope.user.password_confirmation = null;
        });
    };
  });

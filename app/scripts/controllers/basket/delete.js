'use strict';

angular
  .module('korbjagdApp')
  .controller('BasketDeleteCtrl', function($scope, $state, Basket) {
    if (!$scope.isCurrentUser($scope.basket.user)) {
      $scope.showBasket($scope.basket);
    }
    $scope.setTitle('Delete', $scope.basket.name);

    $scope.delete = function() {
      Basket.delete({basketId: $scope.basket.id}, function() {
        $scope.rmBasket($scope.basket);
        $state.go('map.app.home');
      });
    };
  });

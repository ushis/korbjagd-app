'use strict';

angular
  .module('korbjagdApp')
  .controller('BasketCtrl', function($scope, $state, $timeout, $window,
                                     Address, Basket, Photo, basket) {

    $scope.setTitle(basket.basket.name);
    $scope.basket = basket.basket;
    $scope.address = null;
    $scope.image = {};

    // Center map on basket
    $scope.map.geolocation = false;
    $scope.map.zoom = 16;
    $scope.map.center = angular.copy($scope.basket);

    // Try to find the address of the basket
    Address.get($scope.basket, function(address) {
      $scope.address = address;
    });

    // Auto update photo
    $scope.$watch('image', function() {
      if (!$scope.image.url) {
        return;
      }
      $scope.basket.photo = {url: $scope.image.url};
      var data = {photo: {image: $scope.image.url}};

      Photo.update({basketId: $scope.basket.id}, data, function(resp) {
        $scope.basket.photo = resp.photo;
      });
    }, true);
  });

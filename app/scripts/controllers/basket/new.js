'use strict';

angular
  .module('korbjagdApp')
  .controller('BasketNewCtrl', function($scope, $filter, $stateParams,
                                        categories, nearbyBaskets, Basket) {

    $scope.setTitle('New Basket');
    $scope.categories = categories.categories;
    $scope.nearbyBaskets = nearbyBaskets.baskets;
    $scope.checkedCategories = {};

    $scope.basket = {
      name: null,
      description: null,
      latitude: $stateParams.latitude,
      longitude: $stateParams.longitude
    };

    $scope.goToForm = function() {
      $scope.showForm = true;
    };

    $scope.show = function(key) {
      if (!$scope.getCurrentUser()) {
        return key === 'signin-note';
      }

      if ($scope.nearbyBaskets.length > 0) {
        return key === 'nearby-note';
      }
      return key === 'form';
    };

    $scope.ignoreNearbyBaskets = function() {
      $scope.nearbyBaskets = [];
    };

    $scope.submit = function() {
      var basket = angular.copy($scope.basket);
      basket.category_ids = [];

      angular.forEach($scope.checkedCategories, function(checked, id) {
        if (checked) {
          basket.category_ids.push(id);
        }
      });

      Basket.save({basket: basket}).$promise
        .then(function(resp) {
          $scope.setBasket(resp.basket);
          $scope.showBasket(resp.basket);
        })
        .catch(function(resp) {
          var titleize = $filter('titleize');
          $scope.errors = {};

          angular.forEach(resp.data.details, function(details, attr) {
            $scope.errors[attr] = [titleize(attr), details[0]].join(' ');
          });
        });
    };
  });

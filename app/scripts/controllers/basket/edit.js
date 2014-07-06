'use strict';

angular
  .module('korbjagdApp')
  .controller('BasketEditCtrl', function($scope, $filter, categories, Basket) {
    if (!$scope.allowedToEdit()) {
      $scope.showBasket($scope.basket);
    }
    $scope.setTitle('Edit', $scope.basket.name);

    $scope.categories = categories.categories;
    $scope.checkedCategories = {};

    $scope.basket.categories.forEach(function(category) {
      $scope.checkedCategories[category.id] = true;
    });

    $scope.submit = function() {
      var basket = angular.copy($scope.basket);
      basket.category_ids = [];

      angular.forEach($scope.checkedCategories, function(checked, id) {
        if (checked) {
          basket.category_ids.push(id);
        }
      });

      $scope.errors = {};

      Basket.update({basket: basket}).$promise
        .then(function(resp) {
          angular.extend($scope.basket, resp.basket);
          $scope.showBasket($scope.basket);
        })
        .catch(function(resp) {
          var titleize = $filter('titleize');

          angular.forEach(resp.data.details, function(details, attr) {
            $scope.errors[attr] = [titleize(attr), details[0]].join(' ');
          });
        });
    };
  });

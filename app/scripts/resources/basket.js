'use strict';

angular
  .module('korbjagdApp')
  .factory('Basket', function($resource, ENV) {
    return $resource(ENV.api + '/baskets/:basketId', {
      basketId: '@basket.id'
    }, {
      update: {method: 'PATCH'},
      query: {
        method: 'GET',
        url: ENV.api + '/sectors/:sectorId/baskets'
      }
    });
  });


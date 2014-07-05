'use strict';

angular
  .module('korbjagdApp')
  .factory('Address', function($cacheFactory, google) {
    var cache = $cacheFactory('geocodes');
    var geocoder = new google.maps.Geocoder();

    return {
      get: function(loc, callback) {
        var key = [loc.latitude, loc.longitude].join(',');
        var address = cache.get(key);

        if (address) {
          callback(address);
          return;
        }
        var latLng = {lat: loc.latitude, lng: loc.longitude};

        geocoder.geocode({location: latLng}, function(res) {
          if (res.length > 0) {
            address = res[0].formatted_address;
            cache.put(key, address);
            callback(address);
          }
        });
      }
    };
  });

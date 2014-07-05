'use strict';

angular
  .module('korbjagdApp')
  .controller('MapCtrl', function($scope, $state, $timeout, $document, $window,
                                  _, geolocation, google, Basket) {

    // Hash containing all loaded Baskets
    $scope.allBaskets = {};

    // Sets a baskets in the hash of loaded baskets
    $scope.setBasket = function(basket) {
      basket.show = function() { $scope.showBasket(basket); };
      $scope.allBaskets[basket.id] = basket;
    };

    // Removes a basket from the hash of loaded baskets
    $scope.rmBasket = function(basket) {
      delete($scope.allBaskets[basket.id]);
    };

    // Keep map.baskets and allBaskets in sync.
    $scope.$watch('allBaskets', function() {
      $scope.map.baskets = _.toArray($scope.allBaskets);
    }, true);

    // Goes to a basket
    $scope.showBasket = function(basket) {
      $state.go('map.app.basket.details', {basketId: basket.id});
    };

    // Loads additional baskets
    var loadBaskets = function() {
      var bounds = $scope.map.instance.getBounds();
      var sw = bounds.getSouthWest();
      var ne = bounds.getNorthEast();

      var params = {
        'bounds[]': [
          [sw.lat(), sw.lng()].join(','),
          [ne.lat(), ne.lng()].join(',')
        ]
      };

      Basket.query(params, function(resp) {
        resp.baskets.forEach(function(basket) {
          $scope.setBasket(basket);
        });
      });
    };

    // Initializes the map
    var initMap = function(map) {
      if ($scope.map.instance !== null) {
       return;
      }
      $scope.map.instance = map;

      // Make map draggable
      map.draggable = true;

      // Load additional baskets on bounds change
      map.addListener('bounds_changed', _.debounce(loadBaskets, 600));

      // Open basket form on double click
      map.addListener('dblclick', function(e) {
        $state.go('map.app.basket-new', {
          latitude: e.latLng.lat(),
          longitude: e.latLng.lng()
        });
      });

      // Init search box and load initial baskets
      initSearchBox();
      loadBaskets();
    };

    // Initializes the search box
    var initSearchBox = function() {
      var input = $document[0].getElementById('search-places');
      var searchBox = new google.maps.places.SearchBox(input);

      google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }
        var bounds = new google.maps.LatLngBounds();

        places.forEach(function(place) {
          bounds.extend(place.geometry.location);
        });

        var map = $scope.map.instance;
        map.fitBounds(bounds);

        if (map.getZoom() > 16) {
          map.setZoom(16);
        }
        $state.go('map.app.home');
      });
    };

    // Set sane map defaults
    $scope.map = {
      instance: null,
      center: {latitude: 51.34, longitude: 12.37},
      zoom: 12,
      baskets: [],
      options: {
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        mapTypeControl: true,
        streetViewControl: true
      },
      events: {
        tilesloaded: initMap
      },
      markers: {
        clusterOptions: {
          imagePath: '/images/clusters/m'
        }
      },
      geolocation: true
    };

    // Try to get the users location
    geolocation.getLocation().then(function(loc) {
      if ($scope.map.geolocation) {
        $scope.map.center = angular.copy(loc.coords);
      }
    });

    // Full screen map
    var resizeMap = function() {
      var canvas = $document[0].querySelector('.angular-google-map-container');
      canvas.style.height = $window.innerHeight + 'px';
    };

    $window.addEventListener('resize', _.debounce(resizeMap, 200));
    resizeMap();
  });

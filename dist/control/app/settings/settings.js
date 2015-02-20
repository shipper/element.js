(function() {
  var SettingsConfig, SettingsCtrl;

  SettingsCtrl = function($scope, $http) {
    $scope.api = {
      production: 'Not Set',
      development: 'Not Set',
      production_set: false,
      development_set: false,
      init: function() {
        return $http.get('/api/agent/self/key').success(function(data) {
          return _.assign($scope.api, data["default"]);
        });
      },
      generate: function(type) {
        return $http.get("/api/agent/self/key/" + type).success(function(key) {
          $scope.api[type] = key;
          return $scope.api[type + "_set"] = true;
        });
      },
      reGenerate: function(type) {
        return $http.get("/api/agent/self/key/" + type + "/new").success(function(key) {
          $scope.api[type] = key;
          return $scope.api[type + "_set"] = true;
        });
      }
    };
    return $scope.api.init();
  };

  SettingsCtrl.$inject = ['$scope', '$http'];

  SettingsConfig = function($routeProvider) {
    return $routeProvider.when('/settings', {
      templateUrl: 'app/settings/settings.html',
      controller: 'SettingsCtrl',
      data: {
        title: 'Settings',
        back: '/home'
      }
    }).otherwise('/home');
  };

  SettingsConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(SettingsConfig).controller('SettingsCtrl', SettingsCtrl);

}).call(this);

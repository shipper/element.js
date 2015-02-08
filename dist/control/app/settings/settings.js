(function() {
  var SettingsConfig, SettingsCtrl;

  SettingsCtrl = function($scope) {};

  SettingsCtrl.$inject = ['$scope'];

  SettingsConfig = function($routeProvider) {
    return $routeProvider.when('/settings', {
      templateUrl: 'app/settings/settings.html',
      controller: 'SettingsCtrl'
    }).otherwise('/home');
  };

  SettingsConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(SettingsConfig).controller('SettingsCtrl', SettingsCtrl);

}).call(this);

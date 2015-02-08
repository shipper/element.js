(function() {
  var AppConfig, AppCtrl;

  AppCtrl = function($scope) {};

  AppCtrl.$inject = ['$scope'];

  AppConfig = function($mdThemingProvider) {
    return $mdThemingProvider.theme('default').primaryPalette('cyan');
  };

  AppConfig.$inject = ['$mdThemingProvider'];

  angular.module('ngElement', ['ngRoute', 'ngMaterial']).config(AppConfig).controller('AppCtrl', AppCtrl);

}).call(this);

(function() {
  var HomeConfig, HomeCtrl;

  HomeCtrl = function($scope) {};

  HomeCtrl.$inject = ['$scope'];

  HomeConfig = function($routeProvider) {
    return $routeProvider.when('/home', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeCtrl'
    }).otherwise('/home');
  };

  HomeConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(HomeConfig).controller('HomeCtrl', HomeCtrl);

}).call(this);

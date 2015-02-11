(function() {
  var HomeConfig, HomeCtrl;

  HomeCtrl = function($scope, $location, $http) {
    var find;
    $scope.results = [];
    find = function() {
      return $http.get('/api/type').success(function(data) {
        return $scope.results = data;
      });
    };
    find();
    $scope["new"] = function() {
      return $location.path("/type");
    };
    return $scope.goto = function(type) {
      return $location.path("/type/" + type.key + "/elements");
    };
  };

  HomeCtrl.$inject = ['$scope', '$location', '$http'];

  HomeConfig = function($routeProvider) {
    return $routeProvider.when('/home', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeCtrl'
    }).otherwise('/home');
  };

  HomeConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(HomeConfig).controller('HomeCtrl', HomeCtrl);

}).call(this);

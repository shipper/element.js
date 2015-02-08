(function() {
  var LoginConfig, LoginCtrl;

  LoginCtrl = function($scope, $http, Session, $location) {
    $scope.user = {
      username: null,
      password: null
    };
    return $scope.login = function() {
      return $http.post('/api/agent/login', $scope.user).success(function(token) {
        console.log(token);
        Session.create(token);
        return $location.path('/home');
      });
    };
  };

  LoginCtrl.$inject = ['$scope', '$http', 'Session', '$location'];

  LoginConfig = function($routeProvider) {
    return $routeProvider.when('/login', {
      templateUrl: 'app/login/login.html',
      controller: 'LoginCtrl'
    });
  };

  LoginConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(LoginConfig).controller('LoginCtrl', LoginCtrl);

}).call(this);

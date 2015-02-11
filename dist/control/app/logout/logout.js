(function() {
  var LogoutConfig, LogoutCtrl;

  LogoutCtrl = function(Session) {
    return Session.destroy();
  };

  LogoutCtrl.$inject = ['Session'];

  LogoutConfig = function($routeProvider) {
    return $routeProvider.when('/logout', {
      templateUrl: 'app/logout/logout.html',
      controller: 'LogoutCtrl',
      data: {
        title: 'Logout'
      }
    });
  };

  LogoutConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(LogoutConfig).controller('LogoutCtrl', LogoutCtrl);

}).call(this);

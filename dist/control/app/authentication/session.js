(function() {
  var Session;

  Session = function($window, $location, $rootScope) {
    var checkPath, key, self, token;
    key = 'AUTH_TOKEN';
    token = $window.sessionStorage.getItem(key);
    self = {
      token: token,
      create: function(token) {
        $window.sessionStorage.setItem(key, token);
        self.token = token;
        return checkPath();
      },
      destroy: function() {
        $window.sessionStorage.removeItem(key);
        self.token = void 0;
        return checkPath();
      }
    };
    checkPath = function() {
      var auth, path;
      path = $location.path();
      auth = self.token != null;
      if (/^\/?login$/.test(path)) {
        if (!auth) {
          return;
        }
        return $location.path('/home');
      } else {
        if (auth) {
          return;
        }
        return $location.path('/login');
      }
    };
    checkPath();
    $rootScope.$on('$locationChangeSuccess', function() {
      return checkPath();
    });
    return self;
  };

  Session.$inject = ['$window', '$location', '$rootScope'];

  angular.module('ngElement').service('Session', Session);

}).call(this);

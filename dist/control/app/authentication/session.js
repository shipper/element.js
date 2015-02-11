(function() {
  var Session;

  Session = function($window, $location, $rootScope) {
    var checkPath, key, library, library_key, self, token;
    key = 'AUTH_TOKEN';
    library_key = 'LIBRARY_TOKEN';
    token = $window.sessionStorage.getItem(key);
    library = $window.sessionStorage.getItem(library_key);
    self = {
      token: token,
      library: library,
      create: function(token) {
        self.destroy(true);
        $window.sessionStorage.setItem(key, token);
        self.token = token;
        return checkPath();
      },
      destroy: function(noCheckPath) {
        if (noCheckPath == null) {
          noCheckPath = false;
        }
        $window.sessionStorage.removeItem(key);
        $window.sessionStorage.removeItem(library_key);
        self.token = void 0;
        self.library = void 0;
        if (noCheckPath) {
          return;
        }
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

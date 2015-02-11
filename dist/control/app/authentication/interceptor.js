(function() {
  var AuthInterceptor, AuthInterceptorConfig;

  AuthInterceptor = function($rootScope, $q, Session) {
    var self;
    self = {
      request: function(config) {
        if (config.headers == null) {
          config.headers = {};
        }
        if (Session.token) {
          config.headers.Authorization = "Bearer " + Session.token;
        }
        if (Session.library) {
          config.headers['X-Element-Library'] = Session.library;
        }
        return config;
      },
      response: function(response) {
        if (response.status === 401) {
          console.log('Unauthorized');
        }
        return response || $q.when(response);
      }
    };
    return self;
  };

  AuthInterceptor.$inject = ['$rootScope', '$q', 'Session'];

  AuthInterceptorConfig = function($httpProvider) {
    return $httpProvider.interceptors.push('AuthInterceptor');
  };

  AuthInterceptorConfig.$inject = ['$httpProvider'];

  angular.module('ngElement').factory('AuthInterceptor', AuthInterceptor).config(AuthInterceptorConfig);

}).call(this);

AuthInterceptor = ( $rootScope, $q, Session ) ->
  self =
    request: ( config ) ->

      config.headers ?= { }

      if Session.token
        config.headers.Authorization = "Bearer #{ Session.token }"

      if Session.library
        config.headers[ 'X-Element-Library' ] = Session.library

      return config

    response: ( response ) ->

      if response.status is 401
        # return to login
        console.log( 'Unauthorized' )

      return response || $q.when( response )

  return self

AuthInterceptor.$inject = [ '$rootScope', '$q', 'Session' ]

AuthInterceptorConfig = ( $httpProvider ) ->
  $httpProvider.interceptors.push( 'AuthInterceptor' )

AuthInterceptorConfig.$inject = [ '$httpProvider' ]

angular.module( 'ngElement' )
.factory( 'AuthInterceptor', AuthInterceptor )
.config( AuthInterceptorConfig )
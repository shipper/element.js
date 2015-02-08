LoginCtrl = ( $scope, $http, Session, $location ) ->
  $scope.user = {
    username: null,
    password: null
  }

  $scope.login = ->

    $http.post(
      '/api/agent/login',
      $scope.user
    )
    .success( ( token ) ->
      console.log( token )
      Session.create( token )

      $location.path( '/home' )

    )



LoginCtrl.$inject = [ '$scope', '$http', 'Session', '$location' ]

LoginConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/login', {
      templateUrl: 'app/login/login.html',
      controller: 'LoginCtrl'
  })

LoginConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( LoginConfig )
.controller( 'LoginCtrl', LoginCtrl )
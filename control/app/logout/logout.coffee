LogoutCtrl = ( Session ) ->
  Session.destroy( )

LogoutCtrl.$inject = [ 'Session' ]

LogoutConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/logout', {
    templateUrl: 'app/logout/logout.html',
    controller: 'LogoutCtrl'
  })

LogoutConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( LogoutConfig )
.controller( 'LogoutCtrl', LogoutCtrl )
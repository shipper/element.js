AppCtrl = ( $scope, Session, $location ) ->

  $scope.Session = Session

  $scope.$on( 'back-path', ( event, path ) ->
    $scope.back = path
  )

  $scope.$on( '$routeChangeSuccess', ( event, next ) ->
    unless next?.data?
      $scope.title = undefined
      $scope.back = undefined
      return
    $scope.title = next.data.title
    $scope.back = next.data.back
  )

  $scope.goBack = ->
    unless $scope.back?
      return
    $location.path( $scope.back )


AppCtrl.$inject = [ '$scope', 'Session', '$location' ]

AppConfig = ( $mdThemingProvider ) ->

  $mdThemingProvider.theme('default')
    .primaryPalette('cyan')

AppConfig.$inject = [ '$mdThemingProvider', '$locationProvider' ]


angular.module(
  'ngElement',
  [
    'ngRoute'
    'ngMaterial'
    'uuid'
  ]
)

.config( AppConfig )

.controller( 'AppCtrl', AppCtrl )


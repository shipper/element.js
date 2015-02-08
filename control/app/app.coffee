AppCtrl = ( $scope ) ->


AppCtrl.$inject = [ '$scope' ]

AppConfig = ( $mdThemingProvider ) ->

  $mdThemingProvider.theme('default')
    .primaryPalette('cyan')

AppConfig.$inject = [ '$mdThemingProvider' ]


angular.module(
  'ngElement',
  [
    'ngRoute'
    'ngMaterial'
  ]
)

.config( AppConfig )

.controller( 'AppCtrl', AppCtrl )


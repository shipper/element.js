SettingsCtrl = ( $scope ) ->

SettingsCtrl.$inject = [ '$scope' ]

SettingsConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/settings', {
      templateUrl: 'app/settings/settings.html',
      controller: 'SettingsCtrl'
      data:
        title: 'Settings'
        back: '/home'
    })
  .otherwise( '/home' )

SettingsConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( SettingsConfig )
.controller( 'SettingsCtrl', SettingsCtrl )
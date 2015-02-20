SettingsCtrl = ( $scope, $http ) ->


  $scope.api = {
    production: 'Not Set'
    development: 'Not Set'
    production_set: false
    development_set: false
    init: ->
      $http.get( '/api/agent/self/key' )
      .success( ( data ) ->
        _.assign( $scope.api, data.default )
      )

    generate: ( type ) ->
      $http.get( "/api/agent/self/key/#{ type }" )
      .success( ( key ) ->
        $scope.api[ type ] = key
        $scope.api[ "#{ type }_set" ] = true
      )

    reGenerate: ( type ) ->
      $http.get( "/api/agent/self/key/#{ type }/new" )
      .success( ( key ) ->
        $scope.api[ type ] = key
        $scope.api[ "#{ type }_set" ] = true
      )


  }

  $scope.api.init( )



SettingsCtrl.$inject = [ '$scope', '$http' ]

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
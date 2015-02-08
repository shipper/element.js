Session = ( $window, $location, $rootScope ) ->
  key = 'AUTH_TOKEN'
  token = $window.sessionStorage.getItem( key )

  self =
    token: token

    create: ( token ) ->
      $window.sessionStorage.setItem( key, token )
      self.token = token
      checkPath( )

    destroy: ->
      $window.sessionStorage.removeItem( key )
      self.token = undefined
      checkPath( )

  checkPath = ->

    path = $location.path( )

    auth = self.token?

    if /^\/?login$/.test( path )
      unless auth
        return
      return $location.path( '/home' )
    else
      if auth
        return
      $location.path( '/login' )

  checkPath( )

  $rootScope.$on( '$locationChangeSuccess', ->

    checkPath( )

  )

  return self

Session.$inject = [ '$window', '$location', '$rootScope' ]

angular.module( 'ngElement' )
.service( 'Session', Session )
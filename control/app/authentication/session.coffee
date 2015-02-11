Session = ( $window, $location, $rootScope ) ->
  key = 'AUTH_TOKEN'
  library_key = 'LIBRARY_TOKEN'
  token = $window.sessionStorage.getItem( key )
  library = $window.sessionStorage.getItem( library_key )

  self =
    token: token
    library: library

    create: ( token ) ->

      self.destroy( true )

      $window.sessionStorage.setItem( key, token )
      self.token = token

      checkPath( )

    destroy: ( noCheckPath = false ) ->
      $window.sessionStorage.removeItem( key )
      $window.sessionStorage.removeItem( library_key )
      self.token = undefined
      self.library = undefined
      if noCheckPath
        return
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
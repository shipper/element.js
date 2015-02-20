class ElementClient
  constructor: ( @host = 'http://elementjs.nz/' ) ->
    @setQ( window.Q )

  setQ: ( q ) ->
    unless q?.defer instanceof Function
      return
    @Q = q


  element: ( key ) ->
    deferred = @Q.defer( )



    return deferred.promise



this.ElementClient = ElementClient
restify  = require( 'restify' )
Q        = require( 'q' )
mongoose = require( './mongoose' )
routes   = require( './routes' )

class ElementInstance
  constructor: ( options ) ->
    @mongoose = mongoose
    @port = options?.port or 4000
    @client = restify.createServer(
      name: 'element-instance'
      acceptable: [
        'application/json',
        'text/html'
      ]
    )

    @client.use( restify.acceptParser( @client.acceptable ) )
    @client.use( restify.dateParser() )
    @client.use( restify.queryParser() )
    @client.use( restify.jsonp() )
    @client.use( restify.gzipResponse() )
    @client.use( restify.bodyParser( mapParams: false ) )

    @_bind( )
    @_registerRoutes( )

  _bind: ->
    for key, val of @client
      unless val instanceof Function
        continue
      if @hasOwnProperty( key )
        continue
      @[ key ] = val.bind( @client )

  _registerRoutes: ->
    routes.register( @ )
    

  start: ->
    deferred = Q.defer( )
    @client.listen( @port, =>
      deferred.resolve( @ )
    )
    return deferred.promise


module.exports = ElementInstance
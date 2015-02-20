authentication  = require( '../../authentication' )
Agent           = require( '../../data/agent' )
_               = require( 'lodash' )
Q               = require( 'q' )

{ Token } = authentication

exports.register = ( server ) ->
  server.get( '/api/agent/self', authentication, exports.get )
  server.get( '/api/agent/self/key', authentication, exports.keys )
  server.get( '/api/agent/self/key/set/:set/type/:type', authentication, exports.generate )
  server.get( '/api/agent/self/key/set/:set', authentication, exports.generate )
  server.get( '/api/agent/self/key/:type', authentication, exports.generate )
  server.del( '/api/agent/self/key/set/:set/type/:type', authentication, exports.kill )
  server.del( '/api/agent/self/key/set/:set', authentication, exports.kill )
  server.del( '/api/agent/self/key/:type', authentication, exports.kill )
  server.get( '/api/agent/self/key/set/:set/type/:type/new', authentication, exports.reGenerate )
  server.get( '/api/agent/self/key/set/:set/new', authentication, exports.reGenerate )
  server.get( '/api/agent/self/key/:type/new', authentication, exports.reGenerate )

  server.post( '/api/agent/login', exports.login )

exports.login = ( req, res, next ) ->
  Agent.findByUsername( req.body.username )
  .then( ( agent ) ->
    return agent.verifyPassword( req.body.password )
  )
  .then( ( agent ) ->
    return Token.generate( agent, Token.AUTHENTICATION )
  )
  .then( ( token ) ->
    res.send( 200, token )
  )
  .fail( ( error ) ->
    next( error )
  )

exports.getKeys = ( agent ) ->

  result = { }
  api = agent.api

  unless api?.keys?
    return Q.resolve( result )

  keys = _.keys( api.keys )

  unless keys.length
    return Q.resolve( result )

  promises = _.map( keys, ( key ) ->
    return exports.getKeysForSet( agent, key )
    .then( ( keys ) ->
      result[ key ] = keys
    )
  )

  return Q
  .all(
    promises
  )
  .then( ->
    return result
  )

exports.getKeysForSet = ( agent, set_name ) ->

  obj = {
    production: null
    production_set: false
    development: null
    development_set: false
  }

  api = agent.api

  unless api?.keys?
    return Q.resolve( obj )

  set = api.keys[ set_name ]

  unless set?
    return Q.resolve( obj )

  keys = [
    #Token.AUTHENTICATION,
    Token.PRODUCTION,
    Token.DEVELOPMENT
  ]

  set_keys = _.keys( set )

  keys = _.filter( keys, ( key ) ->
    return set_keys.indexOf( key ) isnt -1
  )

  unless keys.length
    return Q.resolve( obj )

  promises = _.map( keys, ( key ) ->
    return authentication.Token.generate( agent, key, set_name )
    .then( ( token ) ->
      obj[ key ] = token
    )
  )

  Q.all(
    promises
  )
  .then( ->
    _.each( keys, ( key ) ->
      obj[ "#{ key }_set" ] = !!obj[ key ]
    )

    return obj
  )


exports.keys = ( req, res ) ->

  exports.getKeys( req.user )
  .then( ( keys ) ->
    res.send( 200, keys )
  )
  .fail( ( error ) ->
    res.send( 500, error )
  )



exports.get = ( req, res ) ->
  res.send( 200, req.user )

exports.generate = ( req, res ) ->

  authentication.Token.generate( req.user, req.params.type, req.params.set )
  .then( ( key ) ->
    res.send( 200, key )
  )
  .fail( ( err ) ->
    res.send( 500, err )
  )

exports.reGenerate = ( req, res ) ->

  authentication.Token.kill( req.user, req.params.type, req.params.set )
  .then( ->
    return authentication.Token.generate( req.user, req.params.type, req.params.set )
  )
  .then( ( key ) ->
    res.send( 200, key )
  )
  .fail( ( err ) ->
    res.send( 500, err )
  )


exports.kill = ( req, res ) ->

  authentication.Token.kill( req.user, req.params.type, req.params.set )
  .then( ->
    res.send( 204 )
  )
  .fail( ( err ) ->
    res.send( 500, err )
  )

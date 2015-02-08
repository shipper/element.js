authentication            = require( '../../authentication' )
Agent                     = require( '../../data/agent' )

exports.register = ( server ) ->
  server.get( '/api/agent/self', authentication, exports.get )

  server.post( '/api/agent/login', exports.login )

exports.login = ( req, res, next ) ->
  Agent.findByUsername( req.body.username )
  .then( ( agent ) ->
    return agent.verifyPassword( req.body.password )
  )
  .then( ( agent ) ->
    return authentication.Token.generate( agent )
  )
  .then( ( token ) ->
    res.send( 200, token )
  )
  .fail( ( error ) ->
    next( error )
  )

exports.get = ( req, res ) ->
  res.send( 200, req.user )
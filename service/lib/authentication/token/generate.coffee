uuid = require( 'node-uuid' )
Q    = require( 'q' )
jwt  = require( 'jsonwebtoken' )

module.exports = ( agent ) ->
  unless agent?.uuid?
    return Q.reject( 'Invalid agent' )

  if agent.api_key
    obj = {
      key: agent.uuid
      api_key: agent.api_key
    }
    return Q.resolve(
      jwt.sign(
        obj,
        process.env.ELEMENT_JWT_KEY ?= 'ELEMENT_DEV'
      )
    )

  agent.api_key = uuid.v4( )

  return agent.savePromise( )
  .then( ->
    return module.exports( agent )
  )
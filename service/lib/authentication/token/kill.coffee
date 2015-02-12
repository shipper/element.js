Generate = require( './generate' )

module.exports = exports = ( agent, type = Generate.AUTHENTICATION, set = 'default' ) ->

  unless (
    type? and
    set? and
    agent?.api?.keys?[ set ]?[ type ]?
  )
    return Q.resolve( @ )

  agent.api.keys[ set ][ type ] = undefined

  return agent.savePromise( )

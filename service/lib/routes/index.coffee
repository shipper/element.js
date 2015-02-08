element = require( './element' )
agent   = require( './agent'   )
type    = require( './type'    )
$static = require( './static'  )

exports.register = ( server ) ->
  element .register( server )
  agent   .register( server )
  type    .register( server )
  $static .register( server )
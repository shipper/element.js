ElementInstance = require( './lib/instance' )

new ElementInstance( )
.start( )
.then( ->
  console.log( 'Started server' )
)
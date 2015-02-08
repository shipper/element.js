pkg = require( '../../../../package.json' )

exports.register = ( server ) ->
  server.get( "/api/metadata", exports.metadata )

exports.metadata = ( req, res ) ->

  res.send( 200, {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    homepage: "http://elementjs.nz/"
  })


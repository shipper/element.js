schema   = require( './schema' )
model    = require( '../model' )

module.exports = Element = model.define(
  'Organization',
  schema
)
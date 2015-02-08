schema   = require( './schema' )
model    = require( '../model' )

module.exports = Agent = model.define(
  'Agent',
  schema
)
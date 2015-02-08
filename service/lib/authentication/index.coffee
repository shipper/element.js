passport = require( 'passport' )
Bearer   = require( './bearer' )
Token    = require( './token' )

Bearer.register( passport )

module.exports = exports = Bearer.authenticate

exports.Bearer   = Bearer
exports.Token    = Token
exports.Passport = passport

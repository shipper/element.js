/**
 * Created by fabian on 9/02/15.
 */
var sequest = require('sequest')

var GIT_REPO = 'git@github.com:shipper/element.js.git';
var SSH_KEY_PASSWORD = 'jackpot1638'
var GIT_BRANCH = 'master';
var SSH_USERNAME = 'fabain';
var SSH_PASSWORD = 'jackpot1638';
var SSH_HOST = '128.199.110.156';

sequest( SSH_HOST, {
    username: SSH_USERNAME,
    password: SSH_PASSWORD,
    common: 'cd ~/ && git clone ' + GIT_REPO + ''
},
function( err, stdout ) {
  console.log( 'yup' )
  console.log( err, stdout );
});



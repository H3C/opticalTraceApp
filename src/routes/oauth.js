var express = require('express');
var router = express.Router();
var Oauth = require('../server/oauth');

router.post('/token', Oauth.login);

module.exports = router;

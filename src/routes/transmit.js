var express = require('express');
var router = express.Router();
var transmit = require('../server/transmit');

router.get('/*', transmit.transmitResuest.bind({method: 'GET'}));
router.post('/*', transmit.transmitResuest.bind({method: 'POST'}));

module.exports = router;

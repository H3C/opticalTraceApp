var express = require('express');
var router = express.Router();
var fs = require('fs');
var procFun = require('../request/proc');

/* GET users listing. */
router.post('/list', procFun.procGetOmList);
router.post('/receive', procFun.procOmReceive);
router.post('/receiveAll', procFun.procOmReceiveAll);
router.post('/send', procFun.procSend);
router.post('/getuserinfo', procFun.procGetUserInfo);
router.post('/search-user', procFun.searchUser)
module.exports = router;
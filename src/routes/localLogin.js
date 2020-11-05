var express = require('express');
var router = express.Router();
var userDB = require('../db/user');
const Cache = require('../cache/cache');
const myRequest = require('../util/request');
const config = require('../config/list.config');

router.post('/token', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    var sql = `select * from user where user_sso_correlation = "${username}"`;
    userDB.query(sql, function(err, data) {
        if (err) {
            res.send('login failed');
        } else if (data.length){
            if (data[0].password !==  password) {
                res.send('login failed');
            } else {
                var options = {
                    uri: `https://${config.host}:${config.port}/v2/token`,
                    maxRedirects: 1,
                    timeout: 5000,
                    method: 'POST',
                    strictSSL: false, // 停用SSL证书认证
                    headers: {
                        // Authorization: token,
                        'Content-Type': 'application/json',
                    },
                    body: {
                        username: data[0].user_organ,
                        password: "666666",
                    },
                    json: true,
                };

                myRequest.send(options)
                    .then((response) => {
                        if(response && response.success) {
                            Cache.set(username, {token: response.token});
                            console.log("login success");
                            res.setHeader("Content-Type", "application/json;charset=utf-8");
                            res.send({
                                "access_token": response.token
                            });
                            userDB.query(`update user set token = "${response.token}" where user_sso_correlation = "${username}"`, function(err) {
                                err && console.log('update user schema failed.')
                            })
                        }else{
                            res.send('login failed')
                        }

                    }).catch((err) => {
                        res.send('login failed')
                    })
            }
        } else {
            res.send('login failed')
        }
    })
});



module.exports = router;

const url = require('url');
const config = require('../config/auth.config');
const myRequest = require('../util/request');
const Cache = require('../cache/cache');
const logger = require('../util/logger');

function login(req, res) {
    const options = Object.assign({
        uri: `http://${config.host}:${config.port}/oauth${req.url}`,
        method: 'POST',
        body: {},
        json: true
    });
    //用户登录时保存access_token、refresh_token以及token超时时间到本地
    myRequest.send(options)
        .then(response => new Promise((r, j) => {
            checkToken(response.access_token)
                .then(result => r({...response, expires: result.exp}))
                .catch(e => j(e))
        }))
        .then(response => {
            Cache.set(response['sub'], {
                token: response.access_token,
                refresh_token: response.refresh_token,
                expires: response.expires
            })
            res.send(response);
        })
        .catch(err => {
            logger.error(err)
    })
}

function refreshToken(refresh_token) {
    const query = config.query;
    const options = {
        uri: `http://${config.host}:${config.port}/oauth/refresh_token?` +
            `client_id=${query.client_id}&client_secret=${query.client_secret}&grant_type=refresh_token&token=${refresh_token}`,
        method: 'POST',
    };
    //access_token即将过期时调用刷新接口,刷新access_token、refresh_token以及token超时时间
    myRequest.send(options)
        .then(response => new Promise((r, j) => {
            checkToken(response.access_token)
                .then(result => r({...response, expires: result.exp}))
                .catch(e => j(e))
        }))
        .then(response => {
            Cache.set(response.sub, {
                token: response.access_token,
                refresh_token: response.refresh_token,
                expires: response.expires
            });
            res.send(response);
        })
        .catch(err => {
            logger.error(err)
        })
}

function checkToken(token) {
    return new Promise((resolve, reject) => {
        var options = {
            uri: `http://${config.host}:${config.port}/oauth/check_token?token=${token}`,
            method: 'POST',
            body: {},
            json: true
        }

        myRequest.send(options)
            .then((res) => {
                resolve(res)
            })
            .catch(err => reject(err))
    })
}

module.exports = {
    login: login,
    refreshToken: refreshToken,
    checkToken: checkToken
}
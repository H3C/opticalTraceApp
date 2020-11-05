const myRequest = require('../util/request');
const logger = require('../util/logger');
const config = require('../config/list.config');

function transmitResuest(req, res) {
    var token = req.headers['authorization'];
    var url = req.url;
    if (/channels\/(\w)+\/appOperation$/.test(req.url)) {
        url = url.replace(/\/(\w)+\/appOperation$/, `/${config.channelId}/chaincodeOperation`)
    }
    if (token) {
        token = token.replace(/^JWT(%20)?/, 'JWT ')
    }
    var options = {
        uri: `https://${config.host}:${config.port}/v2${url}`,
        maxRedirects: 1,
        timeout: 5000,
        method: this.method || 'GET',
        strictSSL: false, // 停用SSL证书认证
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
        body: {
            chaincode_operation: {
                operation: req.body['chaincode_operation[operation]'],
                functionName: req.body['chaincode_operation[functionName]'],
                args: req.body['chaincode_operation[args]'],
                chaincodeId: config.chaincodeId,
            }
        },
        json: true
    };
    myRequest.send(options)
        .then((response) => {
            console.log(response)
            logger.info(`[${req.url}] Transmit success!`);
            res.send(response)
        }).catch((err) => {
        console.log(err)
            res.send({status: 'failed'})
        })
}

module.exports = {
    transmitResuest: transmitResuest
}

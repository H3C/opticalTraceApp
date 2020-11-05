var request = require('request');
var logger = require('./logger');

function myRequest() {}

myRequest.prototype.send = function (options) {
    logger.warn('Send: %s', JSON.stringify(options));
    return new Promise((resolve, reject) => {
        request(options, function (err, response, body) {
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        })
    })
};

module.exports= new myRequest();

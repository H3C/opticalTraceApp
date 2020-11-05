const config = require('../config/list.config');
const myRequest = require('../util/request');
var getUserList = require('../server/index').getUserList;
var getSyncData = require('../server/index').getSyncData;
var updateLocalData = require('../server/index').updateLocalData;
// var getToken = require('./auth').getToken;
var updateToken = require('../server/index').updateToken;
var Cache = require('../cache/cache');
var logger =  require('../util/logger');

var doing = false; // 是否处于同步过程中

var LEN = 20;

function formatStringG(item) {
    return `${item.bar_code},${item.item_code},${item.ownername},${item.owner_id},${item.contract_id},${item.shipment_id},${item.receivename},${item.receive_id},${item.node_date},${item.new_flag},${item.transfer_permissison},${item.transfer_note},${item.opt_status}`
}
function formatStringE(item) {
    return `${item.bar_code},OWNER,${item.ownername},OWNER_CODE,${item.owner_id},Contractno,${item.contract_id},SHIPMENT_NUMBER,${item.shipment_id},RECEIVE_CODE,${item.receive_id},RECEIVE_NAME,${item.receivename},NODE_DATE,${item.node_date},TransferPermission,${item.transfer_permissison || ''},OptStatus,${item.opt_status}`;
}

function syncRemoteData(data) {
    var options = {
        uri: `https://${config.host}:${config.port}/v2/channels/${config.channelId}/chaincodeOperation`,
        maxRedirects: 1,
        timeout: 10000,
        method: 'POST',
        strictSSL: false, // 停用SSL证书认证
        headers: {
            'Content-Type': 'application/json',
        },
        json: true
    }
    var body = {
        chaincode_operation: {
            chaincodeId: config.chaincodeId,
            operation: 'invoke',
        }
    }
    var arr = data.slice(0, LEN);
    var ids = [];

    return new Promise((resolve, reject) => {
        if (arr && arr.length) {
            // 异步执行，业务量大时，此处需要优化
            Promise.all(arr.map(item => new Promise((res, rej) => {
                    let cache = Cache.get(item.correlation);
                    console.log(item, cache)
                    options.headers.Authorization = (cache && cache.token) || item.token;
                    if (parseInt(item.status) === 1) {
                        body.chaincode_operation.functionName = 'create';
                        body.chaincode_operation.args = formatStringG(item);
                    } else {
                        body.chaincode_operation.functionName = 'edit';
                        body.chaincode_operation.args = formatStringE(item);
                    }
                    options.body = body;
                    // 记录需要更新mysql的数据id
                    logger.debug(`光模块[${item.bar_code}]转移数据开始记录, 数据:${JSON.stringify(body)}`);
                    myRequest.send(options).then((result) => {
                        if (result && result.success) {
                            logger.info(`光模块[${item.bar_code}]转移数据记录成功, %s`, JSON.stringify(result));
                            ids.push(item.id);
                        } else {
                            logger.error(`光模块[${item.bar_code}]转移数据记录失败, %s`, JSON.stringify(result))
                        }
                        res(null);
                    }).catch(e => {
                        logger.error(`光模块[${item.bar_code}]转移数据记录失败, %o`, e);
                        res(null)
                    });
                })
            ))
                .then(() => {
                    if (data.length >= LEN) {
                        syncRemoteData(data.slice(LEN))
                            .then(res => resolve([...ids, ...res]))
                            .catch(() => resolve(ids))
                    } else {
                        resolve(ids)
                    }
                })
                .catch(() => resolve(ids))
        } else {
            resolve(ids)
        }
    })
}

function refresh (users) {
    return new Promise((resolve, reject) => {
        var timestemp = new Date().valueOf();
        var refresh = [];
        users.map(user => {
            var cacheData = Cache.get(user.user_sso_correlation);
            if (cacheData && (cacheData.expires > timestemp + 30 * 60)) {
                // refresh token
                logger.warn("[%s]Update token...", user.user_sso_correlation);
                refresh.push(refreshToken(cacheData.refresh_token))
            }
        })
        resolve(null)
    })
}
function sync() {
    logger.debug('*********** Task begin ***********')
    doing = true;
    Promise.resolve()
        .then(getUserList)
        .then(refresh)
        .then(getSyncData)
        .then(syncRemoteData)
        .then(updateLocalData)
        .then(() => {
            logger.debug('*********** Task end ***********')
            doing = false;
            return;
        })
        .catch(err => {
            logger.error(err);
            logger.debug('*********** Task end ***********')
            doing = false;
        })
}
function task() {
    if (doing) {
        // 执行中，则终止本次任务
        return;
    } else {
        sync();
    }
}
function createTicker() {
    setInterval(task, 10000)
}

module.exports = {
    createTicker: createTicker,
}

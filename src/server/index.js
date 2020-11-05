const codeToCn = require('../util/code').codeToCn;
var userDB = require('../db/user');
var moduleDB = require('../db/module');
var logger = require('../util/logger');

function dbOption(db, sql, callback) {
    db.query(sql, callback)
}

function procResponse(code, data, response) {
    var responseData = {
        status: 0,
    };
    if (code) {
        responseData.msg = codeToCn(code);
    } else {
        responseData.data = data;
    }
    response.send(responseData);
}
function transformOpticalKey(params) {
    var transformObj = Object.keys(params).reduce((obj, key) => {
        var value = params[key]
        if (key && (value !== '')) {
            if (key === 'optstatus') {
                key = 'opt_status';
            }
            key = key.replace(/(?!^)[A-Z](?!$)/g, '_$&').toLowerCase();
            obj[key] = value;
        }
        return obj;
    }, {});
    return transformObj;
}
function procGetOmList(req, res, next) {
    var params = req.body;
    var pageNum = req.body.pageNum;
    var pageSize = req.body.pageSize;
    delete params.pageNum;
    delete params.pageSize;

    var query = '';
    var limit = '';
    params = transformOpticalKey(params);
    query += Object.keys(params).map(function(key) {
        return `${key}="${params[key]}"`;
    }).join(' and ')
    query = query ? ` where ${query}` : '';
    if (pageNum && pageSize) {
        limit= ` limit ${(pageNum - 1) * pageSize}, ${pageSize}`;
    }
    var sql = "select om.id, owner_id, bar_code, contract_id, shipment_id, DATE_FORMAT(node_date,'%Y/%m/%d %H:%i:%S') node_date, ur.user_name owner_name from optical_module as om left join `user` as ur on ur.user_id = om.owner_id"
        + `${query} order by id ${limit}`
    var sql_count = `select count(*) from optical_module${query}`;
    dbOption(moduleDB, `${sql_count};${sql}`, (err, result) => {
        var response = {
            status: 1,
            msg: 'GET_FAILED',
        }
        if (err) {
            // 异常
        } else if (!result[0][0]['count(*)']) {
            response.msg = "GET_NO_DATA";
        } else {
            response.status = 0;
            delete response.msg;
            response.data = {
                pageNum: pageNum,
                pageSize: pageSize,
                total: result[0][0]['count(*)'],
                list: result[1],
            }
        }
        responseMsg(response, res);
    })
};

function handleReveice (sql_count, sql, check, res) {
    var response = {
        status: 1,
        msg: 'UPDATE_FAILED',
    };
    dbOption(moduleDB, sql_count, function(err, count) {
        if (err) {
            responseMsg(response, res);
        } else if (count && ((count[0]['count(*)'] < check) || (!check && count[0]['count(*)']))) {
            response.msg = "HAS_UPDATEING_TO_BLOCK";
            responseMsg(response, res);
        } else {
            dbOption(moduleDB, sql, function(err, data) {
                if (err) {
                    responseMsg(response, res);
                } else {
                    response.status = 0;
                    response.msg = "UPDATE_SUCCESS";
                    responseMsg(response, res);
                }
            })
        }
    })
}
function procOmReceive(req, res, next) {
    var params = req.body;
    var token = params.token;
    var query =  params.ids.split(',').map(function(id){ return `id="${id}"`}).join(' or ');
    var sql_count = `select count(*) from optical_module where status="2" and (${query})`;
    var sql = `update optical_module set owner_id="${params.ownerId}", opt_status="2", status="3", token="${token}"where ${query}`;
    handleReveice(sql_count, sql, params.ids.split(',').length || -1, res);
};

function procOmReceiveAll(req, res, next) {
    var params = req.body;
    var token = params.token;
    delete params.token;
    params = transformOpticalKey(params);
    var query = '';
    query += Object.keys(params).map(function(key) {
        return `${key}="${params[key]}"`;
    }).join(' and ')

    var sql_count = `select count(*) from optical_module where not(status="2") and ${query}`;
    var sql = `update optical_module set owner_id="${params.receive_id}", opt_status="2", status="3", token="${token}" where ${query}`;
    handleReveice(sql_count, sql, 0, res);
};
function procSend(req, res, next) {
    var params = req.body;
    var query =  params.ids.split(',').map(function(id){ return `id="${id}"`}).join(' or ');
    var sql_count = `select count(*) from optical_module where status="2" and (${query})`;
    var sql = `update optical_module set shipment_id="${params.shipmentId}", contract_id="${params.contractId || ''}", opt_status="1", status="3", token="${params.token}", receive_id="${params.receiveId}" where opt_status="2" and ${query}`
    var response = {
        status: 1,
        msg: 'UPDATE_FAILED'
    };
    dbOption(moduleDB, sql_count, (err, count) => {
        if (err) {
            responseMsg(response, res);
        } else if (count && ((count[0]['count(*)'] < params.ids.split(',').length))) {
            response.msg = "HAS_UPDATEING_TO_BLOCK";
            responseMsg(response, res);
        } else {
            dbOption(moduleDB, sql, function(err, data) {
                if (err) {
                    responseMsg(response, res);
                } else {
                    response.status = 0;
                    response.msg = "UPDATE_SUCCESS";
                    responseMsg(response, res);
                }
            })
        }
    })
};
function procGetUserInfo(req, res, next) {
    var params = req.body;
    var sql = `select * from user where ${params.type} = "${params.values.trim()}"`;
    dbOption(userDB, sql, function(err, data) {
        var response = {
            status: 0,
        }
        if (err || !data || !data.length) {
            response.status = 1;
            response.msg = "USER_NOT_EXIST";
        } else {
            response.data = data || [];
            response.data = response.data.map(function(item) {
                item.user_organ = item.user_sso_correlation;
                return item;
            })
        }
        responseMsg(response, res)
    })
};
function searchUser(req, res, next) {
    var params = req.body;
    var response = {
        status: 0,
    }
    var sql = `select * from user where user_sso_correlation like "%${params.userName || ''}%" order by id limit 5`;
    dbOption(userDB, sql, function(err, data) {
        if (err) {
            response.status = 1;
            response.msg = "GET_FAILED";
            responseMsg(response, res);
        } else {
            data = data.map(function(item) {
                return item.user_sso_correlation;
            })
            response.list = data || null;
            responseMsg(response, res);
        }
    })
}
function responseMsg(response, handle) {
    if (response.msg) {
        response.msg = codeToCn(response.msg);
    }

    handle.send(response);
}
function getSyncData () {
    return new Promise((resolve, reject) => {
        // 搜索status为1或者3的数据，为1的执行create，为3的执行更新
        var sql = "select om.*,ur.user_name receivename, ue.user_name ownername,'' new_flag, ue.user_sso_correlation correlation, ue.token token from optical_module as om LEFT JOIN `user` as ur on om.receive_id = ur.user_id LEFT JOIN `user` as ue on om.owner_id = ue.user_id where om.`status`=1 or om.`status`=3  LIMIT 0,200";
        dbOption(moduleDB, sql, function(err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data);
            }
        })
    })
}
function updateLocalData(ids) {
    return new Promise((resolve, reject) => {
        if (ids && ids.length) {
            var sql = "UPDATE optical_module SET `status`='2' WHERE " + ids.map(id => `id="${id}"`).join(' or ');
            dbOption(moduleDB, sql, function(err, data) {
                if (err) {
                    logger.error("数据上链后，本地库更新失败！ids: ", ids.join(','));
                } else {
                    logger.info('Update local data succeed, ids: ', ids.join(','));
                }
                resolve()
            })
        } else {
            resolve()
        }
    })
}

function getUserList() {
    return new Promise((resolve, reject) => {
        var sql = 'select * from user';
        dbOption(userDB, sql, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}
function updateToken(tokenInfo) {
    return new Promise((resolve, reject) => {
        var arr = [];
        if (!tokenInfo.length) {
            resolve(null);
            return;
        }
        tokenInfo.map(item => arr.push(`update optical_module set token = '${item.access_token}' WHERE owner_id = ${item.owner_id}`))

        dbOption(moduleDB, arr.join(';'), function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        })
    })
}
module.exports = {
    procGetOmList: procGetOmList,
    procOmReceive: procOmReceive,
    procOmReceiveAll: procOmReceiveAll,
    procSend: procSend,
    procGetUserInfo: procGetUserInfo,
    searchUser: searchUser,
    getUserList: getUserList,
    updateToken: updateToken,

    // 上链接口
    getSyncData: getSyncData,
    updateLocalData: updateLocalData,
}

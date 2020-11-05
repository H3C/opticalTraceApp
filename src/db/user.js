var mysql = require('mysql');
var config = require('../config/db.config');
var logger = require('../util/logger');

var UserModel = {
    pool: mysql.createPool(config),
}

UserModel.query = function(sql, callback) {
    var pool = this.pool;
    logger.info('SQL: %s', sql);
    pool.getConnection(function(err, connection) {
        if (err) {
            logger.error('[Mysql]Error: ', err)
            callback(err);
        } else {
            connection.query(sql, function(err, res){
                callback(err, res)
                connection.release();
            })
        }
    })
}

module.exports = UserModel;
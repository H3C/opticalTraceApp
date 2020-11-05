var mysql = require('mysql');
var config = require('../config/db.config');
var logger = require('../util/logger');

var OpticalModel = {
    pool: mysql.createPool(config),
};

OpticalModel.query = function(sql, callback) {
    logger.info('SQL: %s', sql);
    var pool = this.pool;
    pool.getConnection(function(err, connection) {
        if (err) {
            logger.error('[Mysql]Error: ', err)
            callback(err);
        } else {
            connection.query(sql, function(err, res){
                if (err) {
                    logger.error('[Mysql]Error: ', err);
                }
                callback(err, res);
                connection.release();
            })
        }
    })
}

module.exports = OpticalModel;

module.exports = {
    host: process.env.MYSQL_IP || "10.114.134.79",
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "123456",
    database: "optical_module",
    connectionLimit: 1000,
    multipleStatements: true, // 支持多条件语句查询
    acquireTimeout: 30000,
}

module.exports = {
    host: process.env.SSO_IP || '10.114.134.34',
    port: process.env.SSO_PORT || '10380',
    query: {
        client_id: process.env.SSO_AUTH_CLIENT_ID || 'GuangMoKuai', // 认证中心注册时的客户端ID
        client_secret: process.env.SSO_AUTH_CLIENT_PASSWORD || '666666',  // 客户端验证密码
        grant_type: 'password', // 认证类型，默认密码认证
        scope: 'user_info',      // 暂时无效
        username: 'h3c_test',  // 认证中心注册的用户名
        password: '123456@'     // 密码
    }
}
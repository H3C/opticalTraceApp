module.exports = {
    chaincodeId: process.env.GAEA_CHAINCODE_ID || "5f6afe95e02a6400e3e5a732",
    channelId: process.env.GAEA_CHANNEL_ID || "5f69b861e02a6400e3e5a6bc",
    host: process.env.GAEA_OPERATORDASHBOARD_IP || '10.114.134.79',
    port: process.env.GAEA_OPERATORDASHBOARD_PORT || '8081',
}

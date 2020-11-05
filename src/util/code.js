const CODE = {
    SUCCESS: '',
    FAILED: '失败',

    USER_NOT_EXIST: '用户不存在',

    GET_SUCCESS: '查询成功',
    GET_FAILED: '查询失败',
    GET_NO_DATA: '未查询到数据',

    UPDATE_SUCCESS: '更新成功',
    UPDATE_FAILED: '更新失败',
    HAS_UPDATEING_TO_BLOCK: '有数据未更新到区块链，请稍后再试',
}

function codeToChinese(code) {
    return CODE[code];
}

module.exports = {
    codeToCn: codeToChinese,
}
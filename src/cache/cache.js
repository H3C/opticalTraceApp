function Cache() {
    this.map = new Map();
};

// value [token, exp]
Cache.prototype.set = function (key, value) {
    this.map.set(key, value);
};

Cache.prototype.get = function (key) {
    return this.map.get(key);
};

module.exports= new Cache();
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _redis2 = require('redis');

var _redis3 = _interopRequireDefault(_redis2);

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

var _consts = require('../consts');

var _consts2 = _interopRequireDefault(_consts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class representing a verifyCode.
 */
var VerifyCode = function () {

    /**
     * Create a verifyCode.
     * @param {Object} opts
     */
    function VerifyCode() {
        var _this = this;

        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, VerifyCode);

        _jmEvent2.default.enableEvent(this);
        this.ready = false;
        this.secret = opts.secret || '';
        this.verifyCodeKey = opts.verifyCodeKey || _consts2.default.VerifyCodeKey;
        this.verifyCodeExpire = opts.verifyCodeExpire || 60;

        var cbReady = function cbReady() {
            _this.emit('ready');
        };
        var redis = opts.redis;
        if (typeof opts.redis === 'string') {
            redis = _redis3.default.createClient(opts.redis);
            redis.once('ready', cbReady);
        }
        if (!redis) {
            redis = _redis3.default.createClient();
            redis.once('ready', cbReady);
        }
        this.redis = redis;
    }

    /**
     * 生成验证码
     * @param length
     * @param cb
     */


    _createClass(VerifyCode, [{
        key: 'create',
        value: function create(length, cb) {
            if (typeof length === 'function') {
                cb = length;
                length = 0;
            }
            length || (length = _consts2.default.VerifyCodeLength);
            var Num = '';
            for (var i = 0; i < length; i++) {
                Num += Math.floor(Math.random() * 10);
            }
            cb && cb(null, num);
            return Num;
        }

        /**
         * 添加验证码
         * @param {Object} opts
         * @example
         * opts参数:{
         *  key: key
         *  code: code(可选)
         *  expire: 过期时间, 单位秒
         * }
         * @param {Function} cb
         * @return {Promise}
         */

    }, {
        key: 'add',
        value: function add(opts, cb) {
            if (cb) {
                this.add(opts).then(function (doc) {
                    cb(null, doc);
                }).catch(cb);
                return this;
            }

            var self = this;
            var redis = this.redis;
            opts.expire || (opts.expire = this.verifyCodeExpire);
            opts.code || (opts.code = this.create());
            opts.time || (opts.time = Date.now());
            return new _bluebird2.default(function (resolve, reject) {
                redis.hset(self.verifyCodeKey, opts.key, JSON.stringify(opts), function (err, doc) {
                    if (err) throw err;
                    resolve(opts);
                });
            });
        }

        /**
         * 检查验证码
         * @param {String} code
         * @param {Function} cb
         * @return {VerifyCode} for chaining
         */

    }, {
        key: 'check',
        value: function check(key, code, cb) {
            if (cb) {
                this.check(key, code).then(function (doc) {
                    cb(null, doc);
                }).catch(cb);
                return this;
            }

            var self = this;
            var redis = this.redis;
            return new _bluebird2.default(function (resolve, reject) {
                redis.hget(self.verifyCodeKey, key, function (err, doc) {
                    if (err) throw err;
                    if (doc) {
                        try {
                            doc = JSON.parse(doc);
                            if (doc.expire && doc.time + doc.expire * 1000 < Date.now()) {
                                self.delete(key).then(function (doc) {});
                            } else {
                                if (code === doc.code) return resolve(doc);
                            }
                        } catch (e) {
                            throw e;
                        }
                    }
                    resolve(false);
                });
            });
        }

        /**
         * 删除验证码
         * @param {String} key
         * @param {Function} cb
         * @return {Promise}
         */

    }, {
        key: 'delete',
        value: function _delete(key, cb) {
            if (cb) {
                this.delete(key).then(function (doc) {
                    cb(null, doc);
                }).catch(cb);
                return this;
            }

            var self = this;
            var redis = this.redis;
            return new _bluebird2.default(function (resolve, reject) {
                redis.hdel(self.verifyCodeKey, key, function (err, doc) {
                    if (err) throw err;
                    resolve(true);
                });
            });
        }
    }]);

    return VerifyCode;
}();

exports.default = VerifyCode;
module.exports = exports['default'];
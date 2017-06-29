'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    ['redis', 'verifyCodeExpire', 'verifyCodeKey', 'secret'].forEach(function (key) {
        process.env[key] && (opts[key] = process.env[key]);
    });

    var self = this;
    var o = new _service2.default(opts);
    o.router = _router2.default;

    return o;
};

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * verifycode module.
 * @module verifycode
 * @param {Object} opts
 * @example
 * opts参数:{
 *  redis: (可选, 如果不填，自动连接默认 127.0.0.1:6379)
 *  secret: 安全密钥(可选，默认'')
 *  verifyCodeKey: (可选, 默认'verifycode')
 *  verifyCodeExpire: 验证码过期时间, 单位秒(可选, 默认60)
 * }
 * @return {SSO}
 */
module.exports = exports['default'];
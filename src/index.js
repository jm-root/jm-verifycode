import Service from './service';
import router from './router';

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
export default function (opts = {}) {
    ['redis', 'verifyCodeExpire', 'verifyCodeKey', 'secret'].forEach(function (key) {
        process.env[key] && (opts[key] = process.env[key]);
    });

    var self = this;
    let o = new Service(opts);
    o.router = router;

    return o;
};

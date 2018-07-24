const Service = require('./service')
const router = require('./router')

/**
 * verifycode module.
 * @module verifycode
 * @param {Object} opts
 * @example
 * opts参数:{
 *  redis: (可选, 如果不填，自动连接默认 127.0.0.1:6379)
 *  secret: 安全密钥(可选，默认'')
 *  verifycode_length: 验证码长度，默认6
 *  verifycode_key: (可选, 默认'verifycode')
 *  verifycode_expire: 验证码过期时间, 单位秒(可选, 默认)
 * }
 * @return {VerifyCode}
 */
module.exports = function (opts = {}) {
  ['redis', 'verifycode_length', 'verifycode_expire', 'verifycode_key', 'secret'].forEach(function (key) {
    process.env[key] && (opts[key] = process.env[key])
  })

  let o = new Service(opts)
  o.router = router

  return o
}

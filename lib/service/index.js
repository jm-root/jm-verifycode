const Promise = require('bluebird')
const _redis = require('redis')
const event = require('jm-event')
const log = require('jm-log4js')
const error = require('jm-err')
const consts = require('../consts')
const Err = error.Err
const t = require('../locale')
Promise.promisifyAll(_redis.RedisClient.prototype)
Promise.promisifyAll(_redis.Multi.prototype)
const logger = log.getLogger('verifycode')

/**
 * Class representing a verifyCode.
 */
class VerifyCode {
  /**
   * Create a verifyCode.
   * @param {Object} opts
   */
  constructor (opts = {}) {
    event.enableEvent(this)
    this.ready = false
    this.t = t
    this.secret = opts.secret || ''
    this.verifyCodeKey = opts.verifycode_key || consts.VerifyCodeKey
    this.verifyCodeExpire = opts.verifycode_expire || consts.verifyCodeExpire
    this.VerifyCodeLength = opts.verifycode_length || consts.VerifyCodeLength

    let redis = null
    if (opts.redis) {
      redis = _redis.createClient(opts.redis)
    } else {
      redis = _redis.createClient()
    }
    redis.on('ready', () => {
      this.ready = true
      this.emit('ready')
    })
    redis.on('end', () => {
      this.ready = false
      this.emit('notready')
    })
    this.redis = redis
  }

  onReady () {
    let self = this
    return new Promise(function (resolve, reject) {
      if (self.ready) return resolve(self.ready)
      self.once('ready', function () {
        resolve(self.ready)
      })
    })
  }

  /**
   * 生成验证码
   * @param length
   */
  create (length) {
    length || (length = this.VerifyCodeLength)
    let Num = ''
    for (let i = 0; i < length; i++) {
      Num += Math.floor(Math.random() * 10)
    }
    return Num
  }

  getKey (id) {
    return this.verifyCodeKey + ':' + id
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
   * @return {Promise}
   */
  async add (opts) {
    let redis = this.redis
    opts.expire || (opts.expire = this.verifyCodeExpire)
    opts.code || (opts.code = this.create(opts.length))
    opts.time || (opts.time = Date.now())
    try {
      await redis.setAsync(this.getKey(opts.key), JSON.stringify(opts), 'EX', opts.expire)
      logger.debug('add %j', opts)
      return opts
    } catch (e) {
      logger.error(e)
      throw error.err(Err.FA_ADD_CODE)
    }
  }

  /**
   * 检查验证码
   * @param {String} key
   * @param {String} code
   * @return {Promise}
   */
  async verify (key, code) {
    if (!code) throw error.err(error.Err.FA_PARAMS)
    try {
      let doc = await this.find(key)
      if (code === doc.code) return doc
    } catch (e) {
      logger.error(e)
      throw e
    }
    throw error.err(Err.FA_VERIFY_CODE)
  }

  /**
   * 查询验证码
   * @param {String} key
   * @return {Promise}
   */
  async find (key) {
    if (!key) throw error.err(error.Err.FA_PARAMS)
    let doc = null
    try {
      doc = await this.redis.getAsync(this.getKey(key))
      doc = JSON.parse(doc)
    } catch (e) {
      logger.error(e)
      throw error.err(Err.FA_INVALID_CODE)
    }
    if (!doc) throw error.err(Err.FA_INVALID_CODE)
    return doc
  }

  /**
   * 删除验证码
   * @param {String} key
   * @return {Promise}
   */
  async delete (key) {
    if (!key) throw error.err(error.Err.FA_PARAMS)
    try {
      await this.redis.delAsync(this.getKey(key))
      return key
    } catch (e) {
      logger.error(e)
      throw error.err(Err.FA_DELETE_CODE)
    }
  }
}

module.exports = VerifyCode

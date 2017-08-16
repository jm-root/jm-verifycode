import Promise from 'bluebird';
import _redis from 'redis';
import event from 'jm-event';
import log from 'jm-log4js';
import consts from '../consts';

/**
 * Class representing a verifyCode.
 */
class VerifyCode {

    /**
     * Create a verifyCode.
     * @param {Object} opts
     */
    constructor (opts = {}) {
        event.enableEvent(this);
        this.logger = log.getLogger('verifyCode');
        this.ready = false;
        this.secret = opts.secret || '';
        this.verifyCodeKey = opts.verifyCodeKey || consts.VerifyCodeKey;
        this.verifyCodeExpire = opts.verifyCodeExpire || 60;

        let cbReady = () => {
            this.emit('ready');
        };
        let redis = opts.redis;
        if (typeof opts.redis === 'string') {
            redis = _redis.createClient(opts.redis);
            redis.once('ready', cbReady);
        }
        if (!redis) {
            redis = _redis.createClient();
            redis.once('ready', cbReady);
        }
        this.redis = redis;
    }

    /**
     * 生成验证码
     * @param length
     * @param cb
     */
    create (length, cb) {
        if(typeof length === 'function'){
            cb = length;
            length = 0;
        }
        length || (length = consts.VerifyCodeLength);
        let Num = '';
        for (let i = 0; i < length; i++) {
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
    add (opts, cb) {
        if(cb){
            this.add(opts)
                .then(function(doc){
                    cb(null, doc);
                })
                .catch(cb)
            ;
            return this;
        }

        let self = this;
        let redis = this.redis;
        opts.expire || (opts.expire = this.verifyCodeExpire);
        opts.code || (opts.code = this.create());
        opts.time || (opts.time = Date.now());
        return new Promise(function (resolve, reject) {
            redis.hset(self.verifyCodeKey, opts.key,
                JSON.stringify(opts), function (err, doc) {
                    if(err) throw err;
                    self.logger.debug('add %j', opts);
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
    check (key, code, cb) {
        if(cb){
            this.check(key, code)
                .then(function(doc){
                    cb(null, doc);
                })
                .catch(cb)
            ;
            return this;
        }

        let self = this;
        let redis = this.redis;
        return new Promise(function (resolve, reject) {
            redis.hget(self.verifyCodeKey, key, function (err, doc) {
                if (err) throw err;
                if (!doc) return resolve(false);
                try {
                    doc = JSON.parse(doc);
                    if (doc.expire &&
                        doc.time + doc.expire * 1000 < Date.now()) {
                        self
                            .delete(key)
                            .then(function (doc) {
                            })
                        ;
                        self.logger.debug('expired: %j', doc);
                    } else {
                        if(code === doc.code) return resolve(doc);
                    }
                    return resolve(false);
                } catch (e) {
                    throw e;
                }
            });
        });
    }

    /**
     * 删除验证码
     * @param {String} key
     * @param {Function} cb
     * @return {Promise}
     */
    delete (key, cb) {
        if(cb){
            this.delete(key)
                .then(function(doc){
                    cb(null, doc);
                })
                .catch(cb)
            ;
            return this;
        }

        let self = this;
        let redis = this.redis;
        return new Promise(function (resolve, reject) {
            redis.hdel(self.verifyCodeKey, key, function (err, doc) {
                if(err) throw err;
                resolve(true);
            });
        });
    }
}

export default VerifyCode;

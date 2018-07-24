const _ = require('lodash')
const error = require('jm-err')
const MS = require('jm-ms-core')
const consts = require('../consts')
let Err = error.Err
Err = _.defaults(Err, consts.Err)
let ms = new MS()

module.exports = function (service, opts = {}) {
  let router = ms.router()
  let routes = service.routes
  let logger = service.logger

  let t = function (doc, lng) {
    if (doc && lng && doc.err && doc.msg) {
      return {
        err: doc.err,
        msg: service.t(doc.msg, lng) || Err.t(doc.msg, lng) || doc.msg
      }
    }
    return doc
  }

  routes.getCode = function (opts, cb) {
    let key = opts.params.key
    if (!key) {
      return cb(null, Err.FA_PARAMS)
    }

    let code = service.create(opts.data.length)
    let data = {key, code}
    _.defaults(data, opts.data)
    service.add(data)
      .then(function (doc) {
        routes.emit('getVerifyCode', opts, data)
        cb(null, data)
      })
      .catch(function (err) {
        cb(err, Err.FAIL)
      })
  }

  routes.checkCode = function (opts, cb) {
    let key = opts.params.key
    let code = opts.data.code
    if (!key || !code) {
      return cb(null, Err.FA_PARAMS)
    }

    service.check(key, code)
      .then(function (doc) {
        routes.emit('checkVerifyCode', opts, doc)
        if (!doc) return cb(null, t(Err.FA_INVALID_VERIFYCODE, opts.lng))
        cb(null, doc)
      })
      .catch(function (err) {
        logger.error(err.stack)
        cb(null, Err.FAIL)
      })
  }

  let _getVerifyCode = function (req, res, next) {
    routes.getCode(req, res, next)
  }
  let _checkVerifyCode = function (req, res, next) {
    routes.checkCode(req, res, next)
  }

  router.add('/:key', 'get', _getVerifyCode)
  router.add('/:key/check', 'get', _checkVerifyCode)

  return router
}

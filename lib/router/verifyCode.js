const _ = require('lodash')
const error = require('jm-err')
const MS = require('jm-ms-core')
const consts = require('../consts')
let Err = error.Err
Err = _.defaults(Err, consts.Err)
let ms = new MS()

module.exports = function (service, opts = {}) {
  let router = ms.router()

  let t = function (doc, lng) {
    if (doc && lng && doc.err && doc.msg) {
      return Object.assign({}, doc, {
        msg: service.t(doc.msg, lng) || Err.t(doc.msg, lng) || doc.msg
      })
    }
    return doc
  }

  async function getCode (opts) {
    let key = opts.params.key
    if (!key) {
      let doc = t(Err.FA_PARAMS, opts.lng)
      throw error.err(doc)
    }

    let code = await service.create(opts.data.length)
    let data = Object.assign({}, opts.data, {key, code})
    let doc = await service.add(data)
    return doc
  }

  async function verifyCode (opts) {
    let key = opts.params.key
    let code = opts.data.code
    if (!key || !code) {
      let doc = t(Err.FA_PARAMS, opts.lng)
      throw error.err(doc)
    }

    let doc = await service.verify(key, code)
    return {ret: doc}
  }

  router
    .add('/:key', 'get', getCode)
    .add('/:key/verify', 'get', verifyCode)
    .add('/:key/check', 'get', verifyCode)

  return router
}

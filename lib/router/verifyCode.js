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

  let cbErr = (e, lng) => {
    if (e.data) {
      e.data = t(e.data, lng)
    }
    throw e
  }

  async function getCode (opts) {
    let key = opts.params.key
    let data = Object.assign({}, opts.data, {key})
    try {
      let doc = await service.add(data)
      return doc
    } catch (e) {
      cbErr(e, opts.lng)
    }
  }

  async function verifyCode (opts) {
    let key = opts.params.key
    let code = opts.data.code
    try {
      let doc = await service.verify(key, code)
      return doc
    } catch (e) {
      cbErr(e, opts.lng)
    }
  }

  router
    .add('/:key', 'get', getCode)
    .add('/:key/verify', 'get', verifyCode)
    .add('/:key/check', 'get', verifyCode) // deprecated

  return router
}

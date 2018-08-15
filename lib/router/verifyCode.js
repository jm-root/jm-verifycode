const wrapper = require('jm-ms-wrapper')
const MS = require('jm-ms-core')
let ms = new MS()

module.exports = function (service, opts = {}) {
  async function getCode (opts) {
    let key = opts.params.key
    let data = Object.assign({}, opts.data, {key})
    let doc = await service.add(data)
    return doc
  }

  async function verifyCode (opts) {
    let key = opts.params.key
    let code = opts.data.code
    let doc = await service.verify(key, code)
    return doc
  }

  const wrap = wrapper(service.t)
  let router = ms.router()
  router
    .add('/:key', 'get', wrap(getCode))
    .add('/:key/verify', 'get', wrap(verifyCode))
    .add('/:key/check', 'get', wrap(verifyCode)) // deprecated

  return router
}

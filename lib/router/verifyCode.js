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

  let router = ms.router()
  router
    .add('/:key', 'get', getCode)
    .add('/:key/verify', 'get', verifyCode)
    .add('/:key/check', 'get', verifyCode) // deprecated

  return router
}

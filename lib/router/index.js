let MS = require('jm-ms-core')
let ms = new MS()
const event = require('jm-event')
const help = require('./help')
const verifyCode = require('./verifyCode')

module.exports = function (opts = {}) {
  let service = this
  let router = ms.router()

  service.routes || (service.routes = {})
  let routes = service.routes
  event.enableEvent(routes)

  router.use(help(service))
  router.use(verifyCode(service))

  return router
}

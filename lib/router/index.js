const wrapper = require('jm-ms-wrapper')
const MS = require('jm-ms-core')
const ms = new MS()
const event = require('jm-event')
const help = require('./help')
const verifyCode = require('./verifyCode')

module.exports = function (opts = {}) {
  let service = this
  let router = ms.router()
  wrapper(service.t)(router)

  service.routes || (service.routes = {})
  let routes = service.routes
  event.enableEvent(routes)

  router.use(help(service))
  router.use(verifyCode(service))

  return router
}

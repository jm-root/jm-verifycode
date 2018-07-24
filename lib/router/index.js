let MS = require('jm-ms-core')
let ms = new MS()
const event = require('jm-event')
const help = require('./help')
const verifyCode = require('./verifyCode')

/**
 * @apiDefine Error
 *
 * @apiSuccess (Error 200) {Number} err 错误代码
 * @apiSuccess (Error 200) {String} msg 错误信息
 *
 * @apiExample {json} 错误:
 *     {
 *       err: 错误代码
 *       msg: 错误信息
 *     }
 */

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

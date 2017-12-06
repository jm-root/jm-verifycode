'use strict';

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

var _help = require('./help');

var _help2 = _interopRequireDefault(_help);

var _verifyCode = require('./verifyCode');

var _verifyCode2 = _interopRequireDefault(_verifyCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MS = require('jm-ms-core');
var ms = new MS();


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

module.exports = function () {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var service = this;
    var router = ms.router();

    service.routes || (service.routes = {});
    var routes = service.routes;
    _jmEvent2.default.enableEvent(routes);

    router.use((0, _help2.default)(service));
    router.use((0, _verifyCode2.default)(service));

    return router;
};
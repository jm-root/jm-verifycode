'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jmErr = require('jm-err');

var _jmErr2 = _interopRequireDefault(_jmErr);

var _jmMsCore = require('jm-ms-core');

var _jmMsCore2 = _interopRequireDefault(_jmMsCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Err = _jmErr2.default.Err;
var ms = new _jmMsCore2.default();

module.exports = function (service) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var router = ms.router();
    var routes = service.routes;

    routes.getCode = function (opts, cb) {
        var key = opts.params.key;
        if (!key) {
            return cb(null, Err.FA_PARAMS);
        }

        var code = service.create(opts.data.length);
        var data = { key: key, code: code };
        _lodash2.default.defaults(data, opts.data);
        service.add(data).then(function (doc) {
            routes.emit('getVerifyCode', opts, data);
            cb(null, data);
        }).catch(function (err) {
            cb(err, Err.FAIL);
        });
    };

    routes.checkCode = function (opts, cb) {
        var key = opts.params.key;
        var code = opts.data.code;
        if (!key || !code) {
            return cb(null, Err.FA_PARAMS);
        }

        service.check(key, code).then(function (doc) {
            routes.emit('checkVerifyCode', opts, doc);
            cb(null, doc);
        }).catch(function (err) {
            cb(err, Err.FAIL);
        });
    };

    var _getVerifyCode = function _getVerifyCode(req, res, next) {
        routes.getCode(req, res, next);
    };
    var _checkVerifyCode = function _checkVerifyCode(req, res, next) {
        routes.checkCode(req, res, next);
    };

    router.add('/:key', 'get', _getVerifyCode);
    router.add('/:key/check', 'get', _checkVerifyCode);

    return router;
};
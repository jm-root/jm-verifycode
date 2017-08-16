import _ from 'lodash';
import error from 'jm-err';
import MS from 'jm-ms-core';
let Err = error.Err;
let ms = new MS();

module.exports = function (service, opts = {}) {
    let router = ms.router();
    let routes = service.routes;
    let logger = service.logger;

    routes.getCode = function (opts, cb) {
        let key = opts.params.key;
        if (!key) {
            return cb(null, Err.FA_PARAMS);
        }

        let code = service.create(opts.data.length);
        let data = {key, code};
        _.defaults(data, opts.data);
        service.add(data)
            .then(function (doc) {
                routes.emit('getVerifyCode', opts, data);
                cb(null, data);
            })
            .catch(function (err) {
                cb(err, Err.FAIL);
            });
    };

    routes.checkCode = function (opts, cb) {
        let key = opts.params.key;
        let code = opts.data.code;
        if (!key || !code) {
            return cb(null, Err.FA_PARAMS);
        }

        service.check(key, code)
            .then(function (doc) {
                routes.emit('checkVerifyCode', opts, doc);
                cb(null, doc);
            })
            .catch(function (err) {
                logger.error(err.stack);
                cb(null, Err.FAIL);
            });
    };

    let _getVerifyCode = function (req, res, next) {
        routes.getCode(req, res, next);
    };
    let _checkVerifyCode = function (req, res, next) {
        routes.checkCode(req, res, next);
    };

    router.add('/:key', 'get', _getVerifyCode);
    router.add('/:key/check', 'get', _checkVerifyCode);

    return router;
};

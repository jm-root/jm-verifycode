'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var ERRCODE = 1000;
exports.default = {
	VerifyCodeKey: 'verifycode',
	VerifyCodeLength: 6,
	Err: {
		FA_INVALID_VERIFYCODE: {
			err: ERRCODE++,
			msg: 'invalid verifycode'
		}
	}
};
module.exports = exports['default'];
let ERRCODE = 1000;
export default {
	VerifyCodeKey: 'verifycode',
	VerifyCodeLength: 6,
	Err:{
		FA_INVALID_VERIFYCODE: {
			err: ERRCODE++,
			msg: 'invalid verifycode'
		}
	}
};

let ERRCODE = 4100
module.exports = {
  VerifyCodeKey: 'verifycode',
  VerifyCodeLength: 6,
  verifyCodeExpire: 60,
  Err: {
    FA_ADD_CODE: {
      err: ERRCODE++,
      msg: 'Add Code Fail'
    },
    FA_DELETE_CODE: {
      err: ERRCODE++,
      msg: 'Delete Code Fail'
    },
    FA_INVALID_CODE: {
      err: ERRCODE++,
      msg: 'Invalid Code'
    },
    FA_VERIFY_CODE: {
      err: ERRCODE++,
      msg: 'Verify Code Fail'
    }
  }
}

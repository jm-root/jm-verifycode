# jm-verifycode

验证码生成与校验

## run:

npm start

## run in cluster mode:

npm run cluster

## config

基本配置 请参考 [jm-server] (https://github.com/jm-root/ms/tree/master/packages/jm-server)

redis [] Redis数据库uri

secret [''] 密钥

verifycode_key ['verifycode'] Redis数据库主键

verifycode_length [6] 验证码长度

verifycode_expire [60] 验证码过期时间, 单位秒(可选)
